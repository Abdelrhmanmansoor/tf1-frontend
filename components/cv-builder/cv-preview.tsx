'use client';

import React, { useEffect, useState } from 'react';
import { CVData } from '@/types/cv';
import { CVService } from '@/services/cv.service';
import './cv-preview.css';

interface CVPreviewProps {
  cv: CVData;
  templateId: string;
  compact?: boolean;
}

export default function CVPreview({ cv, templateId, compact = false }: CVPreviewProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const cvService = new CVService();

  useEffect(() => {
    renderPreview();
  }, [cv, templateId]);

  const renderPreview = async () => {
    setIsLoading(true);
    try {
      const html = await cvService.renderToHTML(cv, templateId);
      setHtmlContent(html);
    } catch (error) {
      console.error('Failed to render preview:', error);
      setHtmlContent('<div class="error">Failed to render preview</div>');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`cv-preview ${compact ? 'compact' : ''}`}>
      {isLoading && <div className="loading">Generating preview...</div>}
      {!isLoading && (
        <iframe
          className="preview-frame"
          srcDoc={htmlContent}
          title="CV Preview"
        />
      )}
    </div>
  );
}
