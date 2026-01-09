/**
 * CV Templates for tf1one.com CV Builder
 * 
 * Professional, Modern, and Sports-focused CV templates
 */

import { CVTemplate } from '@/types/cv-builder';

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    nameAr: 'الاحترافي الكلاسيكي',
    description: 'A clean, traditional layout perfect for corporate roles',
    descriptionAr: 'تصميم نظيف وتقليدي مثالي للوظائف المؤسسية',
    thumbnail: '/templates/professional-classic.png',
    category: 'professional',
    colors: {
      primary: '#1a365d',
      secondary: '#2d3748',
      accent: '#3182ce',
    },
    isPopular: true,
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    nameAr: 'الحديث البسيط',
    description: 'Contemporary design with clean lines and modern typography',
    descriptionAr: 'تصميم معاصر بخطوط نظيفة وطباعة حديثة',
    thumbnail: '/templates/modern-minimal.png',
    category: 'modern',
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#a78bfa',
    },
    isPopular: true,
  },
  {
    id: 'sports-champion',
    name: 'Sports Champion',
    nameAr: 'البطل الرياضي',
    description: 'Dynamic layout designed for athletes and sports professionals',
    descriptionAr: 'تصميم ديناميكي مصمم للرياضيين والمحترفين الرياضيين',
    thumbnail: '/templates/sports-champion.png',
    category: 'sports',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
    },
    isPopular: true,
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    nameAr: 'الإبداعي الجريء',
    description: 'Stand out with a unique, eye-catching design',
    descriptionAr: 'تميز بتصميم فريد ولافت للانتباه',
    thumbnail: '/templates/creative-bold.png',
    category: 'creative',
    colors: {
      primary: '#dc2626',
      secondary: '#991b1b',
      accent: '#f87171',
    },
  },
  {
    id: 'executive-elite',
    name: 'Executive Elite',
    nameAr: 'النخبة التنفيذية',
    description: 'Sophisticated design for senior management positions',
    descriptionAr: 'تصميم راقي لمناصب الإدارة العليا',
    thumbnail: '/templates/executive-elite.png',
    category: 'professional',
    colors: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#94a3b8',
    },
  },
  {
    id: 'sports-dynamic',
    name: 'Sports Dynamic',
    nameAr: 'الرياضي الديناميكي',
    description: 'Action-oriented layout with space for achievements and stats',
    descriptionAr: 'تصميم موجه نحو الإنجازات مع مساحة للإحصائيات',
    thumbnail: '/templates/sports-dynamic.png',
    category: 'sports',
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      accent: '#22d3ee',
    },
  },
];

export default CV_TEMPLATES;
