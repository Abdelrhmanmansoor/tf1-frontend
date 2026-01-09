/**
 * Sports Champion CV Template
 * 
 * Dynamic layout designed for athletes and sports professionals
 */

'use client';

import React from 'react';
import { SportsCVData } from '@/types/cv-builder';
import { useLanguage } from '@/contexts/language-context';

interface SportsChampionProps {
  cvData: SportsCVData;
  compact?: boolean;
}

export default function SportsChampion({ cvData, compact = false }: SportsChampionProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const { 
    personalInfo, 
    experience, 
    education, 
    skills, 
    sportsAchievements, 
    athleticStats,
    coachingExperience,
    sportsLicenses,
    physicalAttributes,
    languages: cvLanguages 
  } = cvData;

  return (
    <div 
      className={`bg-white ${compact ? 'scale-[0.4] origin-top-left' : ''}`}
      style={{ 
        fontFamily: isArabic ? 'Alexandria, sans-serif' : 'Montserrat, system-ui, sans-serif',
        direction: isArabic ? 'rtl' : 'ltr',
        width: compact ? '210mm' : '100%',
        minHeight: compact ? '297mm' : 'auto',
      }}
    >
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        {/* Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative px-8 py-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Area */}
            <div className="w-28 h-28 bg-white/20 backdrop-blur rounded-full flex items-center justify-center ring-4 ring-white/30">
              <span className="text-5xl">⚽</span>
            </div>

            <div className="text-center md:text-start flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {personalInfo.fullName || (isArabic ? 'اسم الرياضي' : 'Athlete Name')}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-emerald-100">
                {personalInfo.preferredPosition && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {personalInfo.preferredPosition}
                  </span>
                )}
                {personalInfo.currentClub && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    🏟️ {personalInfo.currentClub}
                  </span>
                )}
                {athleticStats?.sport && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {athleticStats.sport}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {physicalAttributes && (
              <div className="grid grid-cols-2 gap-4 bg-white/10 backdrop-blur rounded-xl p-4">
                {physicalAttributes.height && (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{physicalAttributes.height}</div>
                    <div className="text-xs text-emerald-200">{isArabic ? 'الطول' : 'Height'}</div>
                  </div>
                )}
                {physicalAttributes.weight && (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{physicalAttributes.weight}</div>
                    <div className="text-xs text-emerald-200">{isArabic ? 'الوزن' : 'Weight'}</div>
                  </div>
                )}
                {physicalAttributes.preferredFoot && (
                  <div className="text-center">
                    <div className="text-2xl font-bold capitalize">{physicalAttributes.preferredFoot}</div>
                    <div className="text-xs text-emerald-200">{isArabic ? 'القدم' : 'Foot'}</div>
                  </div>
                )}
                {athleticStats?.yearsActive && (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{athleticStats.yearsActive}</div>
                    <div className="text-xs text-emerald-200">{isArabic ? 'سنوات' : 'Years'}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6 pt-4 border-t border-white/20 text-sm">
            {personalInfo.email && (
              <span className="flex items-center gap-2">📧 {personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-2">📱 {personalInfo.phone}</span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-2">📍 {personalInfo.location}</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-emerald-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded"></span>
              {isArabic ? 'نبذة تعريفية' : 'Profile Summary'}
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Achievements Highlight */}
        {sportsAchievements && sportsAchievements.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              {isArabic ? 'الإنجازات الرياضية' : 'Sports Achievements'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sportsAchievements.map((achievement, index) => (
                <div 
                  key={achievement.id || index}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-amber-700">{achievement.sport}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-amber-100 px-2 py-0.5 rounded capitalize">{achievement.level}</span>
                    <span>{achievement.year}</span>
                  </div>
                  {achievement.description && (
                    <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Experience */}
            {experience && experience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💼</span>
                  {isArabic ? 'الخبرة المهنية' : 'Professional Experience'}
                </h2>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div 
                      key={exp.id || index}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-emerald-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {exp.startDate} - {exp.currentlyWorking ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Coaching Experience */}
            {coachingExperience && coachingExperience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  {isArabic ? 'الخبرة التدريبية' : 'Coaching Experience'}
                </h2>
                <div className="space-y-4">
                  {coachingExperience.map((coach, index) => (
                    <div 
                      key={coach.id || index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
                    >
                      <h3 className="font-semibold text-gray-900">{coach.role}</h3>
                      <p className="text-blue-600 font-medium">{coach.teamName}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                          {coach.sport}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs capitalize">
                          {coach.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            {skills && skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  {isArabic ? 'المهارات' : 'Skills'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span 
                      key={skill.id || index}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  {isArabic ? 'التعليم' : 'Education'}
                </h2>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={edu.id || index} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree} - {edu.fieldOfStudy}
                      </h3>
                      <p className="text-emerald-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sports Licenses */}
            {sportsLicenses && sportsLicenses.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📜</span>
                  {isArabic ? 'الرخص والشهادات الرياضية' : 'Sports Licenses & Certifications'}
                </h2>
                <div className="space-y-2">
                  {sportsLicenses.map((license, index) => (
                    <div 
                      key={license.id || index}
                      className="flex items-center justify-between bg-emerald-50 rounded-lg p-3 border border-emerald-200"
                    >
                      <div>
                        <span className="font-medium text-gray-900">{license.name}</span>
                        <span className="text-sm text-gray-500 ms-2">({license.level})</span>
                      </div>
                      <span className="text-sm text-emerald-600">{license.issuer}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {cvLanguages && cvLanguages.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  {isArabic ? 'اللغات' : 'Languages'}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {cvLanguages.map((lang, index) => (
                    <div 
                      key={lang.id || index}
                      className="bg-gray-100 rounded-lg px-4 py-2 text-center"
                    >
                      <div className="font-medium text-gray-900">{lang.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{lang.level}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
