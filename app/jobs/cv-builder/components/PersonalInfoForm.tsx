'use client';

export default function PersonalInfoForm({ data, update, language }: any) {
  const handleChange = (e: any) => {
    update({ ...data, [e.target.name]: e.target.value });
  };

  const labels = {
    fullName: language === 'ar' ? 'الاسم الكامل' : 'Full Name',
    jobTitle: language === 'ar' ? 'المسمى الوظيفي' : 'Job Title',
    email: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
    phone: language === 'ar' ? 'رقم الهاتف' : 'Phone',
    city: language === 'ar' ? 'المدينة/الدولة' : 'City/Country',
    linkedin: language === 'ar' ? 'رابط LinkedIn (اختياري)' : 'LinkedIn URL (Optional)',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {language === 'ar' ? 'البيانات الشخصية' : 'Personal Information'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{labels.fullName}</label>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{labels.jobTitle}</label>
          <input
            type="text"
            name="jobTitle"
            value={data.jobTitle}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{labels.email}</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{labels.phone}</label>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{labels.city}</label>
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{labels.linkedin}</label>
          <input
            type="text"
            name="linkedin"
            value={data.linkedin}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
      </div>
    </div>
  );
}
