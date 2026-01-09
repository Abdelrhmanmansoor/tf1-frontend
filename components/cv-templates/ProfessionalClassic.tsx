/**
 * Professional Classic CV Template
 * 
 * Clean, traditional layout for corporate roles
 */

'use client';

import React from 'react';
import { SportsCVData } from '@/types/cv-builder';
import { useLanguage } from '@/contexts/language-context';

interface ProfessionalClassicProps {
  cvData: SportsCVData;
  compact?: boolean;
}

export default function ProfessionalClassic({ cvData, compact = false }: ProfessionalClassicProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const { personalInfo, experience, education, skills, sportsAchievements, languages: cvLanguages } = cvData;

  return (
    <div 
      className={`bg-white ${compact ? 'scale-[0.4] origin-top-left' : ''}`}
      style={{ 
        fontFamily: isArabic ? 'Alexandria, sans-serif' : 'Georgia, serif',
        direction: isArabic ? 'rtl' : 'ltr',
        width: compact ? '210mm' : '100%',
        minHeight: compact ? '297mm' : 'auto',
      }}
    >
      {/* Header */}
      <div className="bg-[#1a365d] text-white px-8 py-10">
        <h1 className="text-3xl font-bold mb-2">
          {personalInfo.fullName || (isArabic ? 'اسمك الكامل' : 'Your Full Name')}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-blue-100">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <span>📧</span> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <span>📱</span> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <span>📍</span> {personalInfo.location}
            </span>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Professional Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#1a365d] pb-2 mb-4">
              {isArabic ? 'الملخص المهني' : 'Professional Summary'}
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#1a365d] pb-2 mb-4">
              {isArabic ? 'الخبرة العملية' : 'Work Experience'}
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-[#3182ce] font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {exp.startDate} - {exp.currentlyWorking ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#1a365d] pb-2 mb-4">
              {isArabic ? 'التعليم' : 'Education'}
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={edu.id || index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {isArabic ? 'في' : 'in'} {edu.fieldOfStudy}
                    </h3>
                    <p className="text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Section: Skills & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#1a365d] pb-2 mb-4">
                {isArabic ? 'المهارات' : 'Skills'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span 
                    key={skill.id || index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {cvLanguages && cvLanguages.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#1a365d] pb-2 mb-4">
                {isArabic ? 'اللغات' : 'Languages'}
              </h2>
              <ul className="space-y-1">
                {cvLanguages.map((lang, index) => (
                  <li key={lang.id || index} className="text-gray-700">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-gray-500"> - {lang.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sports Achievements */}
        {sportsAchievements && sportsAchievements.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#1a365d] pb-2 mb-4">
              {isArabic ? 'الإنجازات الرياضية' : 'Sports Achievements'}
            </h2>
            <div className="space-y-3">
              {sportsAchievements.map((achievement, index) => (
                <div key={achievement.id || index}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🏆</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">
                        {achievement.sport} • {achievement.level} • {achievement.year}
                      </p>
                      {achievement.description && (
                        <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
