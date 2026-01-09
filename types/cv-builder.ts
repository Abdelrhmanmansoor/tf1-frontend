/**
 * Enhanced CV Types for tf1one.com Sports Platform
 * 
 * Extended CV data types with sports-specific fields
 * Compatible with the existing CV system
 */

// Re-export existing types
export * from './cv';

// ============================================
// SPORTS-SPECIFIC TYPES
// ============================================

/**
 * Sports Achievement
 */
export interface SportsAchievement {
  id: string;
  title: string;
  sport: string;
  level: 'amateur' | 'semi-pro' | 'professional' | 'national' | 'international';
  organization?: string;
  year: string;
  description?: string;
  metrics?: string; // e.g., "Led team to championship", "Scored 25 goals"
}

/**
 * Athletic Statistics
 */
export interface AthleticStats {
  sport: string;
  position?: string;
  yearsActive: number;
  currentLevel: 'amateur' | 'semi-pro' | 'professional' | 'retired';
  teamHistory?: {
    teamName: string;
    startYear: string;
    endYear?: string;
    position: string;
  }[];
}

/**
 * Coaching Experience
 */
export interface CoachingExperience {
  id: string;
  teamName: string;
  sport: string;
  level: 'youth' | 'amateur' | 'semi-pro' | 'professional' | 'national';
  startDate: string;
  endDate?: string;
  currentlyCoaching: boolean;
  role: string; // Head Coach, Assistant, etc.
  achievements?: string[];
  description?: string;
}

/**
 * Sports License/Certification
 */
export interface SportsLicense {
  id: string;
  name: string;
  issuer: string;
  sport: string;
  level: string; // A, B, C, Pro, etc.
  issueDate: string;
  expiryDate?: string;
  licenseNumber?: string;
}

/**
 * Physical Attributes (for players)
 */
export interface PhysicalAttributes {
  height?: string;
  weight?: string;
  preferredFoot?: 'left' | 'right' | 'both';
  fitnessLevel?: 'basic' | 'intermediate' | 'advanced' | 'elite';
}

// ============================================
// EXTENDED CV DATA
// ============================================

import { CVData, PersonalInfo, Experience, Education, Skill } from './cv';

/**
 * Extended Personal Info with sports focus
 */
export interface SportsPersonalInfo extends PersonalInfo {
  nationality?: string;
  dateOfBirth?: string;
  currentClub?: string;
  preferredPosition?: string;
  videoHighlights?: string; // YouTube/Vimeo URL
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

/**
 * Extended CV Data with Sports Fields
 */
export interface SportsCVData extends Omit<CVData, 'personalInfo'> {
  personalInfo: SportsPersonalInfo;
  sportsAchievements?: SportsAchievement[];
  athleticStats?: AthleticStats;
  coachingExperience?: CoachingExperience[];
  sportsLicenses?: SportsLicense[];
  physicalAttributes?: PhysicalAttributes;
  references?: Reference[];
}

/**
 * Reference
 */
export interface Reference {
  id: string;
  name: string;
  title: string;
  organization: string;
  relationship: string;
  email?: string;
  phone?: string;
}

// ============================================
// CV BUILDER STEP DATA
// ============================================

/**
 * CV Builder Step
 */
export interface CVBuilderStep {
  id: number;
  key: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  isCompleted: boolean;
  isActive: boolean;
}

/**
 * CV Builder State
 */
export interface CVBuilderState {
  currentStep: number;
  cvData: SportsCVData;
  selectedTemplate: string;
  isDirty: boolean;
  lastSaved?: Date;
  validationErrors: { [section: string]: string[] };
}

/**
 * CV Template
 */
export interface CVTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  thumbnail: string;
  category: 'professional' | 'modern' | 'creative' | 'sports';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  isPopular?: boolean;
  isPremium?: boolean;
}

/**
 * CV Export Options
 */
export interface CVExportOptions {
  format: 'pdf' | 'html' | 'json' | 'docx';
  template: string;
  includePhoto: boolean;
  pageSize: 'a4' | 'letter';
  language: 'en' | 'ar' | 'both';
}

/**
 * Default empty CV data
 */
export const DEFAULT_CV_DATA: SportsCVData = {
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
  sportsAchievements: [],
  coachingExperience: [],
  sportsLicenses: [],
  references: [],
};

/**
 * CV Builder Steps Configuration
 */
export const CV_BUILDER_STEPS: CVBuilderStep[] = [
  {
    id: 1,
    key: 'basic-info',
    titleEn: 'Basic Information',
    titleAr: 'المعلومات الأساسية',
    descriptionEn: 'Personal details and contact information',
    descriptionAr: 'البيانات الشخصية ومعلومات الاتصال',
    icon: '👤',
    isCompleted: false,
    isActive: true,
  },
  {
    id: 2,
    key: 'experience-education',
    titleEn: 'Experience & Education',
    titleAr: 'الخبرات والتعليم',
    descriptionEn: 'Work history and academic background',
    descriptionAr: 'تاريخ العمل والخلفية الأكاديمية',
    icon: '💼',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 3,
    key: 'skills-achievements',
    titleEn: 'Skills & Achievements',
    titleAr: 'المهارات والإنجازات',
    descriptionEn: 'Professional skills and sports achievements',
    descriptionAr: 'المهارات المهنية والإنجازات الرياضية',
    icon: '🏆',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 4,
    key: 'template-preview',
    titleEn: 'Template & Preview',
    titleAr: 'القالب والمعاينة',
    descriptionEn: 'Choose your CV design and preview',
    descriptionAr: 'اختر تصميم سيرتك الذاتية ومعاينتها',
    icon: '🎨',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 5,
    key: 'generate-export',
    titleEn: 'Generate & Export',
    titleAr: 'إنشاء وتصدير',
    descriptionEn: 'AI suggestions and export to PDF',
    descriptionAr: 'اقتراحات الذكاء الاصطناعي والتصدير إلى PDF',
    icon: '📄',
    isCompleted: false,
    isActive: false,
  },
];
