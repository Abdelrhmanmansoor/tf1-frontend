'use client';

export default function CVPreview({ data, language, onDownload, loading }: any) {
  const isRTL = language === 'ar';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-xl font-semibold text-gray-800">
          {isRTL ? 'معاينة السيرة الذاتية' : 'CV Preview'}
        </h2>
        <button
          onClick={onDownload}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
        >
          {loading ? (isRTL ? 'جاري التحميل...' : 'Downloading...') : (isRTL ? 'تحميل PDF' : 'Download PDF')}
        </button>
      </div>

      <div className="border border-gray-200 shadow-lg p-8 bg-white min-h-[800px] max-w-[210mm] mx-auto" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        {/* Header */}
        <div className="text-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider mb-2">{data.personalInfo.fullName}</h1>
          <p className="text-xl text-gray-600 mb-2">{data.personalInfo.jobTitle}</p>
          <div className="text-sm text-gray-500 flex flex-wrap justify-center gap-4">
            <span>{data.personalInfo.email}</span>
            <span>{data.personalInfo.phone}</span>
            {data.personalInfo.city && <span>{data.personalInfo.city}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 mb-3 uppercase">
              {isRTL ? 'الملخص المهني' : 'Professional Summary'}
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 mb-3 uppercase">
              {isRTL ? 'الخبرة العملية' : 'Experience'}
            </h3>
            <div className="space-y-4">
              {data.experience.map((exp: any, index: any) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-800">{exp.title}</h4>
                    <span className="text-sm text-gray-600">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} - {exp.isCurrent ? (isRTL ? 'الآن' : 'Present') : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">{exp.company}</div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 mb-3 uppercase">
              {isRTL ? 'التعليم' : 'Education'}
            </h3>
            <div className="space-y-3">
              {data.education.map((edu: any, index: any) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-800">{edu.institution}</h4>
                    <span className="text-sm text-gray-600">
                      {edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : ''}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {edu.degree}, {edu.fieldOfStudy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 mb-3 uppercase">
              {isRTL ? 'المهارات' : 'Skills'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: any, index: any) => (
                <span key={index} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
