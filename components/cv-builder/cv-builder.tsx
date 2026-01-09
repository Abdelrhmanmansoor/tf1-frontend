'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CVData } from '@/types/cv';
import { CVService } from '@/services/cv.service';
import CVEditor from './cv-editor';
import CVPreview from './cv-preview';
import TemplateSelector from './template-selector';
import ExportDialog from './export-dialog';
import './cv-builder.css';

interface CVBuilderProps {
  cvId?: string;
  userId: string;
}

export default function CVBuilder({ cvId, userId }: CVBuilderProps) {
  const [cv, setCV] = useState<CVData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('awesome-cv');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'templates' | 'export'>('editor');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [autoSaveDelay, setAutoSaveDelay] = useState<NodeJS.Timeout | null>(null);

  const cvService = new CVService();

  // Load CV on mount
  useEffect(() => {
    if (cvId) {
      loadCV();
    } else {
      initializeNewCV();
    }
  }, [cvId]);

  // Load templates
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadCV = async () => {
    setIsLoading(true);
    try {
      const data = await cvService.getCV(cvId!);
      setCV(data);
      setSelectedTemplate(data.templateId || 'awesome-cv');
    } catch (error) {
      console.error('Failed to load CV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await cvService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const initializeNewCV = () => {
    setCV({
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      volunteer: [],
      publications: [],
      awards: [],
    });
  };

  const handleCVChange = useCallback(
    (updatedCV: CVData) => {
      setCV(updatedCV);

      // Auto-save with delay
      if (autoSaveDelay) {
        clearTimeout(autoSaveDelay);
      }

      const newDelay = setTimeout(() => {
        saveCV(updatedCV);
      }, 3000);

      setAutoSaveDelay(newDelay);
    },
    [autoSaveDelay]
  );

  const saveCV = async (dataToSave: CVData) => {
    setIsSaving(true);
    try {
      if (cvId) {
        await cvService.updateCV(cvId, dataToSave);
      } else {
        const created = await cvService.createCV(dataToSave, selectedTemplate);
        // URL should update to include the new CV ID
        if (created?.id) {
          window.history.replaceState({}, '', `/cv-builder/${created.id}`);
        }
      }
    } catch (error) {
      console.error('Failed to save CV:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    if (cvId && cv) {
      try {
        await cvService.changeTemplate(cvId, templateId);
      } catch (error) {
        console.error('Failed to change template:', error);
      }
    }
  };

  const handlePublish = async () => {
    if (!cvId) return;
    try {
      const result = await cvService.publishCV(cvId);
      const shareUrl = `${window.location.origin}/cv/${result.publicToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert('CV published! Share link copied to clipboard.');
    } catch (error) {
      console.error('Failed to publish CV:', error);
    }
  };

  if (isLoading) {
    return <div className="cv-builder loading">Loading CV...</div>;
  }

  if (!cv) {
    return <div className="cv-builder error">Failed to load CV</div>;
  }

  return (
    <div className="cv-builder">
      <header className="cv-builder-header">
        <h1>CV Builder</h1>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowExportDialog(true)}
          >
            📥 Export
          </button>
          <button className="btn btn-primary" onClick={handlePublish}>
            🔗 Share
          </button>
          {isSaving && <span className="saving-indicator">Saving...</span>}
        </div>
      </header>

      <nav className="cv-builder-tabs">
        <button
          className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          ✏️ Editor
        </button>
        <button
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          🎨 Templates
        </button>
        <button
          className={`tab ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          📄 Preview
        </button>
      </nav>

      <div className="cv-builder-content">
        {activeTab === 'editor' && (
          <div className="editor-section">
            <CVEditor cv={cv} onChange={handleCVChange} />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="templates-section">
            <TemplateSelector
              templates={templates}
              selected={selectedTemplate}
              onSelect={handleTemplateChange}
            />
          </div>
        )}

        {activeTab === 'export' && (
          <div className="preview-section">
            <CVPreview cv={cv} templateId={selectedTemplate} />
          </div>
        )}

        <aside className="preview-sidebar">
          <h3>Preview ({selectedTemplate})</h3>
          <CVPreview cv={cv} templateId={selectedTemplate} compact={true} />
        </aside>
      </div>

      {showExportDialog && (
        <ExportDialog
          cvId={cvId}
          cv={cv}
          templateId={selectedTemplate}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
}
