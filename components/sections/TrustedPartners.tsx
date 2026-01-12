import React from 'react'

export default function TrustedPartners() {
  const partners = [
    { name: "نادي الهلال", logo: "/partners/hilal.png" },
    { name: "نادي النصر", logo: "/partners/nassr.png" },
    { name: "نادي الشباب", logo: "/partners/shabab.png" },
    { name: "نادي الأهلي", logo: "/partners/ahli.png" },
    { name: "نادي القادسية", logo: "/partners/qadisiya.png" },
    { name: "رابطة الدوري السعودي", logo: "/partners/Roshn Saudi League-01.png" },
    { name: "الاتحاد السعودي لكرة القدم", logo: "/partners/SAFF-02.png" },
    { name: "وزارة الموارد البشرية", logo: "/partners/Ministry-of-Labor-and-Social-Development.png" },
    { name: "وقت اللياقة", logo: "/partners/fitnesstime.png" },
    { name: "نادي الفتح", logo: "/partners/fateh.png" },
    { name: "نادي التعاون", logo: "/partners/taawon.png" },
    { name: "رؤية 2030", logo: "/vision-2030.png" },
  ]

  return (
    <section dir="rtl" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center md:text-right">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            شركاؤنا المعتمدون
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mt-2">
            نعمل مع أفضل المؤسسات الرياضية
          </p>
          <p className="max-w-2xl mx-auto md:mx-0 text-gray-500 mt-4 leading-relaxed">
            نفخر بشراكاتنا الاستراتيجية مع الأندية الرياضية الرائدة والاتحادات والمراكز المتخصصة في المملكة العربية السعودية.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-12 items-center justify-center">
          {partners.map((partner) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={partner.name}
              src={partner.logo}
              alt={`شعار ${partner.name}`}
              className="h-14 w-auto mx-auto filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
