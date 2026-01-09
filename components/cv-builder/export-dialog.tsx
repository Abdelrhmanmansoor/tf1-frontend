'use client';

import React, { useState } from 'react';
import { CVData } from '@/types/cv';
import { CVService } from '@/services/cv.service';
import './export-dialog.css';

interface ExportDialogProps {
  cvId?: string;
  cv: CVData;
  templateId: string;
  onClose: () => void;
}

export default function ExportDialog({
  cvId,
  cv,
  templateId,
  onClose,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'html' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const cvService = new CVService();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (selectedFormat === 'pdf') {
        const pdfBlob = await cvService.exportToPDF(cv, templateId);
        downloadFile(pdfBlob, 'cv.pdf');
      } else if (selectedFormat === 'html') {
        const htmlContent = await cvService.renderToHTML(cv, templateId);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        downloadFile(blob, 'cv.html');
      } else if (selectedFormat === 'json') {
        const jsonBlob = new Blob([JSON.stringify(cv, null, 2)], {
          type: 'application/json',
        });
        downloadFile(jsonBlob, 'cv.json');
      }
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Failed to export CV');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="export-dialog-overlay">
      <div className="export-dialog">
        <div className="dialog-header">
          <h2>Export CV</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="dialog-content">
          <div className="format-selector">
            <div className="format-option">
              <input
                type="radio"
                id="format-pdf"
                value="pdf"
                checked={selectedFormat === 'pdf'}
                onChange={(e) => setSelectedFormat(e.target.value as any)}
              />
              <label htmlFor="format-pdf">
                <strong>PDF</strong>
                <p>Professional PDF document (recommended)</p>
              </label>
            </div>

            <div className="format-option">
              <input
                type="radio"
                id="format-html"
                value="html"
                checked={selectedFormat === 'html'}
                onChange={(e) => setSelectedFormat(e.target.value as any)}
              />
              <label htmlFor="format-html">
                <strong>HTML</strong>
                <p>Web-ready HTML document</p>
              </label>
            </div>

            <div className="format-option">
              <input
                type="radio"
                id="format-json"
                value="json"
                checked={selectedFormat === 'json'}
                onChange={(e) => setSelectedFormat(e.target.value as any)}
              />
              <label htmlFor="format-json">
                <strong>JSON</strong>
                <p>Machine-readable JSON format</p>
              </label>
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
}
