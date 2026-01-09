'use client';

import React from 'react';
import './template-selector.css';

interface Template {
  id: string;
  name: string;
  description?: string;
  category?: string;
  preview?: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  selected: string;
  onSelect: (templateId: string) => void;
}

export default function TemplateSelector({
  templates,
  selected,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="template-selector">
      <h2>Choose a Template</h2>
      <div className="template-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selected === template.id ? 'selected' : ''}`}
            onClick={() => onSelect(template.id)}
          >
            <div className="template-preview">
              {template.preview ? (
                <img src={template.preview} alt={template.name} />
              ) : (
                <div className="placeholder">
                  <span className="icon">📄</span>
                  <span>{template.name}</span>
                </div>
              )}
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              {template.description && <p>{template.description}</p>}
              {template.category && <span className="category">{template.category}</span>}
            </div>
            {selected === template.id && <div className="selected-badge">✓</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
