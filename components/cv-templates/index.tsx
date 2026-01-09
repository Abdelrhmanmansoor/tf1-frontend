/**
 * CV Templates Index
 * 
 * Export all CV templates and template renderer
 */

export { default as ProfessionalClassic } from './ProfessionalClassic';
export { default as ModernMinimal } from './ModernMinimal';
export { default as SportsChampion } from './SportsChampion';
export { CV_TEMPLATES } from './templates-config';

import React from 'react';
import { SportsCVData } from '@/types/cv-builder';
import ProfessionalClassic from './ProfessionalClassic';
import ModernMinimal from './ModernMinimal';
import SportsChampion from './SportsChampion';

interface CVTemplateRendererProps {
  templateId: string;
  cvData: SportsCVData;
  compact?: boolean;
}

/**
 * Render appropriate CV template based on templateId
 */
export function CVTemplateRenderer({ templateId, cvData, compact = false }: CVTemplateRendererProps) {
  switch (templateId) {
    case 'professional-classic':
    case 'executive-elite':
      return <ProfessionalClassic cvData={cvData} compact={compact} />;
    
    case 'modern-minimal':
    case 'creative-bold':
      return <ModernMinimal cvData={cvData} compact={compact} />;
    
    case 'sports-champion':
    case 'sports-dynamic':
      return <SportsChampion cvData={cvData} compact={compact} />;
    
    default:
      return <ProfessionalClassic cvData={cvData} compact={compact} />;
  }
}

export default CVTemplateRenderer;
