import { CVData } from '@/types/cv';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class CVService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response;
  }

  async createCV(data: CVData, templateId?: string): Promise<any> {
    const response = await this.fetch('/cv', {
      method: 'POST',
      body: JSON.stringify({ data, templateId }),
    });
    return response.json();
  }

  async getCV(cvId: string): Promise<CVData> {
    const response = await this.fetch(`/cv/${cvId}`);
    const data = await response.json();
    return data.data;
  }

  async getUserCVs(page = 1, limit = 10): Promise<any> {
    const response = await this.fetch(`/cv?page=${page}&limit=${limit}`);
    return response.json();
  }

  async updateCV(cvId: string, data: CVData): Promise<any> {
    const response = await this.fetch(`/cv/${cvId}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
    return response.json();
  }

  async deleteCV(cvId: string): Promise<void> {
    await this.fetch(`/cv/${cvId}`, { method: 'DELETE' });
  }

  async importCV(file: File, format?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (format) {
      formData.append('format', format);
    }

    const headers: HeadersInit = {
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/cv/import`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to import CV');
    }

    return response.json();
  }

  async renderToHTML(cv: CVData, templateId: string): Promise<string> {
    // For now, return a mock HTML. In production, call backend
    return this.generateMockHTML(cv, templateId);
  }

  async renderToPDF(cv: CVData, templateId: string): Promise<Blob> {
    const html = await this.renderToHTML(cv, templateId);
    // For now, convert HTML to PDF on client side
    // In production, use backend PDF endpoint
    return this.htmlToPDF(html);
  }

  async exportToPDF(cv: CVData, templateId: string): Promise<Blob> {
    return this.renderToPDF(cv, templateId);
  }

  async exportToJSON(cv: CVData): Promise<Blob> {
    return new Blob([JSON.stringify(cv, null, 2)], { type: 'application/json' });
  }

  async changeTemplate(cvId: string, templateId: string): Promise<any> {
    const response = await this.fetch(`/cv/${cvId}/template`, {
      method: 'PUT',
      body: JSON.stringify({ templateId }),
    });
    return response.json();
  }

  async publishCV(cvId: string): Promise<any> {
    const response = await this.fetch(`/cv/${cvId}/publish`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    return response.json();
  }

  async getPublicCV(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/cv/public/${token}`);
    if (!response.ok) {
      throw new Error('CV not found');
    }
    return response.json();
  }

  async getTemplates(): Promise<any[]> {
    const response = await this.fetch('/cv/templates');
    const data = await response.json();
    return data || [];
  }

  async getStatistics(): Promise<any> {
    const response = await this.fetch('/cv/stats');
    return response.json();
  }

  // Helper methods
  private generateMockHTML(cv: CVData, templateId: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CV - ${cv.personalInfo.fullName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 10px; }
          .item { margin-bottom: 15px; }
          .item-title { font-weight: bold; }
          .item-subtitle { font-style: italic; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${cv.personalInfo.fullName}</h1>
          <p>${cv.personalInfo.email} | ${cv.personalInfo.phone || ''} | ${cv.personalInfo.location || ''}</p>
        </div>

        ${cv.personalInfo.summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${cv.personalInfo.summary}</p>
          </div>
        ` : ''}

        ${cv.experience.length > 0 ? `
          <div class="section">
            <div class="section-title">Experience</div>
            ${cv.experience.map(exp => `
              <div class="item">
                <div class="item-title">${exp.jobTitle}</div>
                <div class="item-subtitle">${exp.company} | ${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}</div>
                <p>${exp.description}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${cv.education.length > 0 ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${cv.education.map(edu => `
              <div class="item">
                <div class="item-title">${edu.degree} in ${edu.fieldOfStudy}</div>
                <div class="item-subtitle">${edu.school} | ${edu.startDate} - ${edu.endDate}</div>
                ${edu.grade ? `<p>Grade: ${edu.grade}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${cv.skills.length > 0 ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <p>${cv.skills.map(s => s.name).join(', ')}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `;
  }

  private async htmlToPDF(html: string): Promise<Blob> {
    // Simple mock - in production use a library like html2pdf or jsPDF
    return new Blob([html], { type: 'text/html' });
  }
}
