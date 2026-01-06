'use client';

export default function EducationForm({ data, update, language }: any) {
  const addEducation = () => {
    update([
      ...data,
      { degree: '', institution: '', graduationDate: '', fieldOfStudy: '' }
    ]);
  };

  const removeEducation = (index: any) => {
    const newData = [...data];
    newData.splice(index, 1);
    update(newData);
  };

  const handleChange = (index: any, field: any, value: any) => {
    const newData = [...data];
    newData[index][field] = value;
    update(newData);
  };

  const labels = {
    degree: language === 'ar' ? 'الدرجة العلمية' : 'Degree',
    institution: language === 'ar' ? 'المؤسسة التعليمية' : 'Institution',
    graduationDate: language === 'ar' ? 'تاريخ التخرج' : 'Graduation Date',
    fieldOfStudy: language === 'ar' ? 'التخصص' : 'Field of Study',
    add: language === 'ar' ? '+ إضافة تعليم' : '+ Add Education',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        {language === 'ar' ? 'التعليم' : 'Education'}
      </h2>

      {data.map((edu: any, index: any) => (
        <div key={index} className="p-4 border rounded-md bg-gray-50 relative">
          <button
            onClick={() => removeEducation(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{labels.degree}</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                placeholder="BSc, MSc, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{labels.fieldOfStudy}</label>
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{labels.institution}</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleChange(index, 'institution', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{labels.graduationDate}</label>
              <input
                type="date"
                value={edu.graduationDate ? new Date(edu.graduationDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange(index, 'graduationDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
      >
        {labels.add}
      </button>
    </div>
  );
}
