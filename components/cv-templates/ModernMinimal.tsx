/**
 * Modern Minimal CV Template
 * 
 * Contemporary design with clean lines and modern typography
 */

'use client';

import React from 'react';
import { SportsCVData } from '@/types/cv-builder';
import { useLanguage } from '@/contexts/language-context';

interface ModernMinimalProps {
  cvData: SportsCVData;
  compact?: boolean;
}

export default function ModernMinimal({ cvData, compact = false }: ModernMinimalProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const { personalInfo, experience, education, skills, sportsAchievements, languages: cvLanguages } = cvData;

  const getSkillLevel = (level: string) => {
    const levels: { [key: string]: number } = {
      'beginner': 25,
      'intermediate': 50,
      'advanced': 75,
      'expert': 100,
    };
    return levels[level] || 50;
  };

  return (
    <div 
      className={`bg-white ${compact ? 'scale-[0.4] origin-top-left' : ''}`}
      style={{ 
        fontFamily: isArabic ? 'Alexandria, sans-serif' : 'Inter, system-ui, sans-serif',
        direction: isArabic ? 'rtl' : 'ltr',
        width: compact ? '210mm' : '100%',
        minHeight: compact ? '297mm' : 'auto',
      }}
    >
      <div className="flex flex-col md:flex-row min-h-full">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-indigo-600 to-purple-700 text-white p-8">
          {/* Profile Image Placeholder */}
          <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl">👤</span>
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold text-center mb-2">
            {personalInfo.fullName || (isArabic ? 'اسمك' : 'Your Name')}
          </h1>
          
          {/* Current Position */}
          {personalInfo.currentClub && (
            <p className="text-center text-indigo-200 mb-6">{personalInfo.currentClub}</p>
          )}

          {/* Contact Info */}
          <div className="space-y-3 mb-8">
            {personalInfo.email && (
              <div className="flex items-center gap-3 text-sm">
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📧</span>
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-3 text-sm">
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📱</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-3 text-sm">
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📍</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-3 text-sm">
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🔗</span>
                <span className="break-all">{personalInfo.linkedin}</span>
              </div>
            )}
          </div>

          {/* Skills with Progress Bars */}
          {skills && skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>⚡</span> {isArabic ? 'المهارات' : 'Skills'}
              </h2>
              <div className="space-y-3">
                {skills.slice(0, 6).map((skill, index) => (
                  <div key={skill.id || index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="text-indigo-200">{skill.level}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${getSkillLevel(skill.level)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {cvLanguages && cvLanguages.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🌐</span> {isArabic ? 'اللغات' : 'Languages'}
              </h2>
              <div className="space-y-2">
                {cvLanguages.map((lang, index) => (
                  <div key={lang.id || index} className="flex justify-between text-sm">
                    <span>{lang.name}</span>
                    <span className="text-indigo-200">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 p-8 space-y-8">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-1 bg-indigo-600 rounded"></span>
                {isArabic ? 'نبذة عني' : 'About Me'}
              </h2>
              <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-indigo-600 rounded"></span>
                {isArabic ? 'الخبرة' : 'Experience'}
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={exp.id || index} className="relative ps-6 border-s-2 border-indigo-200">
                    <div className="absolute -start-2 top-0 w-4 h-4 bg-indigo-600 rounded-full" />
                    <div className="mb-1">
                      <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="text-indigo-600 font-medium">{exp.company}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">
                          {exp.startDate} - {exp.currentlyWorking ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate}
                        </span>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-indigo-600 rounded"></span>
                {isArabic ? 'التعليم' : 'Education'}
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={edu.id || index} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {isArabic ? 'في' : 'in'} {edu.fieldOfStudy}
                    </h3>
                    <p className="text-indigo-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    {edu.grade && (
                      <p className="text-sm text-gray-600 mt-1">
                        {isArabic ? 'التقدير:' : 'Grade:'} {edu.grade}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sports Achievements */}
          {sportsAchievements && sportsAchievements.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-indigo-600 rounded"></span>
                {isArabic ? 'الإنجازات الرياضية' : 'Sports Achievements'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sportsAchievements.map((achievement, index) => (
                  <div 
                    key={achievement.id || index}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-indigo-600">{achievement.sport}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {achievement.level} • {achievement.year}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
