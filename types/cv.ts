export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  profileImage?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  location?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'elementary' | 'limited' | 'professional' | 'fluent' | 'native';
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  publishDate: string;
  url?: string;
  description?: string;
}

export interface Award {
  id: string;
  title: string;
  awarder: string;
  awardDate: string;
  description?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  volunteer?: Volunteer[];
  publications?: Publication[];
  awards?: Award[];
  templateId?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CV {
  id: string;
  userId: string;
  title: string;
  data: CVData;
  templateId: string;
  isPublished: boolean;
  publicToken?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CVVersion {
  id: string;
  cvId: string;
  versionNumber: number;
  data: CVData;
  createdAt: string;
  changes?: string;
}
