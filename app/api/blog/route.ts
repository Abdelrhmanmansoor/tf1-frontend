import { NextRequest, NextResponse } from 'next/server'

// مقالات افتراضية (بيانات محلية)
// في الإنتاج، ستأتي من قاعدة البيانات أو الباكآند
const DEFAULT_POSTS = [
  {
    id: 'building-sports-team',
    title: 'Building a Winning Sports Team',
    titleAr: 'بناء فريق رياضي فائز',
    excerpt: 'Learn the key principles for building a championship-level sports team from the ground up.',
    excerptAr: 'تعلم المبادئ الأساسية لبناء فريق رياضي بمستوى بطولات من الصفر.',
    content: `Building a successful sports team requires more than just talent. It requires leadership, communication, and a clear vision. 

First, you need to identify your core values. What does your team stand for? What principles will guide every decision? These values become the foundation of your team culture.

Second, invest in player development. The best teams are built by developing young talent consistently. Provide coaching, mentorship, and opportunities for growth.

Third, create a winning culture. This means setting high standards, holding everyone accountable, and celebrating both wins and the effort behind them.

Finally, remember that teamwork makes the dream work. Foster communication and collaboration among all team members.`,
    contentAr: `بناء فريق رياضي ناجح يتطلب أكثر من مجرد موهبة. يتطلب قيادة واتصالات ورؤية واضحة.

أولاً، تحتاج إلى تحديد قيمك الأساسية. ماذا يمثل فريقك؟ ما هي المبادئ التي ستوجه كل قرار؟ تصبح هذه القيم أساس ثقافة فريقك.

ثانياً، استثمر في تطوير اللاعبين. أفضل الفرق تبنى بتطوير المواهب الشابة باستمرار. قدم التدريب والإرشاد والفرص للنمو.

ثالثاً، أنشئ ثقافة رابحة. هذا يعني وضع معايير عالية والمساءلة والاحتفال بالانتصارات.

أخيراً، تذكر أن العمل الجماعي يحقق الحلم.`,
    author: 'Ahmed Mohammed',
    date: '2025-01-15',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    category: 'Team Management',
    readTime: 5,
  },
  {
    id: 'youth-development',
    title: 'Effective Youth Development in Sports',
    titleAr: 'التطوير الفعال للناشئين في الرياضة',
    excerpt: 'Strategies for nurturing young talent and building the next generation of athletes.',
    excerptAr: 'استراتيجيات لتنمية المواهب الشابة وبناء جيل جديد من الرياضيين.',
    content: `Youth development is the backbone of any successful sports organization. It\'s not just about finding talented kids; it\'s about creating an environment where they can flourish.

Key strategies include:

1. Early identification: Spot potential early and provide targeted support.
2. Holistic development: Focus on physical, technical, tactical, and mental development.
3. Mentorship: Pair young players with experienced mentors.
4. Competition: Provide appropriate competitive opportunities to test their skills.
5. Support systems: Ensure players have access to medical, nutritional, and psychological support.

Remember, the goal is not just to create winners, but to develop well-rounded individuals who understand the values of teamwork and perseverance.`,
    contentAr: `تطوير الناشئين هو العمود الفقري لأي منظمة رياضية ناجحة. لا يتعلق الأمر فقط بإيجاد أطفال موهوبين؛ بل يتعلق بخلق بيئة يمكنهم الازدهار فيها.

الاستراتيجيات الأساسية تشمل:

1. التعرف المبكر: اكتشف الإمكانات مبكراً وقدم الدعم الموجه.
2. التطوير الشامل: ركز على التطور البدني والتقني والتكتيكي والعقلي.
3. الإرشاد: ارتبط بين اللاعبين الشباب والمرشدين ذوي الخبرة.
4. المنافسة: وفر فرصاً تنافسية مناسبة لاختبار مهاراتهم.
5. أنظمة الدعم: تأكد من وصول اللاعبين إلى الدعم الطبي والتغذوي والنفسي.

تذكر، الهدف ليس مجرد إنشاء فائزين، بل تطوير أفراد متوازنين يفهمون قيم العمل الجماعي والمثابرة.`,
    author: 'Fatima Al-Rashid',
    date: '2025-01-10',
    image: 'https://images.unsplash.com/photo-1526232216027-694f1b6ff8e6?w=800&q=80',
    category: 'Youth Development',
    readTime: 6,
  },
  {
    id: 'nutrition-athletes',
    title: 'Sports Nutrition Guide for Athletes',
    titleAr: 'دليل التغذية الرياضية للرياضيين',
    excerpt: 'Essential nutrition tips to maximize athletic performance and recovery.',
    excerptAr: 'نصائح تغذية أساسية لتحقيق أقصى أداء رياضي والتعافي.',
    content: `Proper nutrition is fundamental to athletic success. What you eat directly impacts your performance, recovery, and overall health.

Macronutrients breakdown:
- Carbohydrates: Your primary energy source (45-65% of calories)
- Protein: Essential for muscle repair and growth (1.2-2g per kg body weight)
- Fats: Important for hormone production (20-35% of calories)

Timing matters:
- Pre-workout: Eat 1-3 hours before exercise
- Post-workout: Consume protein and carbs within 30-60 minutes
- Throughout the day: Maintain consistent eating patterns

Don\'t forget hydration! Proper hydration is crucial for performance and recovery. Drink water throughout the day, not just during exercise.`,
    contentAr: `التغذية السليمة أساسية للنجاح الرياضي. ما تأكله يؤثر بشكل مباشر على أدائك والتعافي والصحة العامة.

توزيع المغذيات الكبرى:
- الكربوهيدرات: مصدر الطاقة الأساسي (45-65٪ من السعرات)
- البروتين: ضروري لإصلاح وبناء العضلات (1.2-2 غرام لكل كيلوغرام من وزن الجسم)
- الدهون: مهمة لإنتاج الهرمونات (20-35٪ من السعرات)

التوقيت مهم:
- قبل التمرين: تناول الطعام قبل 1-3 ساعات من التمرين
- بعد التمرين: استهلك البروتين والكربوهيدرات في غضون 30-60 دقيقة
- طوال اليوم: حافظ على أنماط الأكل المتسقة

لا تنسَ الترطيب! الترطيب السليم ضروري للأداء والتعافي.`,
    author: 'Dr. Layla Hassan',
    date: '2025-01-05',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    category: 'Nutrition',
    readTime: 7,
  },
]

export async function GET(request: NextRequest) {
  try {
    // محاولة الحصول على المقالات من الباكآند
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'
      const response = await fetch(`${backendUrl}/blog?limit=50`, {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(
          { posts: data.data || data.posts || DEFAULT_POSTS },
          { status: 200 }
        )
      }
    } catch (backendError) {
      console.log('Backend unavailable, using default posts')
    }

    // استخدم البيانات الافتراضية إذا كان الباكآند غير متاح
    return NextResponse.json(
      { posts: DEFAULT_POSTS },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { posts: DEFAULT_POSTS },
      { status: 200 }
    )
  }
}
