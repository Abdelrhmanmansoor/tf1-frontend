import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const BLOG_POSTS = [
  {
    id: 'future-jobs-2030',
    title: 'The Future of Jobs in Saudi Arabia Under Vision 2030',
    titleAr: 'مستقبل الوظائف في المملكة تحت رؤية 2030',
    excerpt: 'How Vision 2030 is transforming the job market in Saudi Arabia, creating new opportunities and shaping the future of employment.',
    excerptAr: 'كيف تحول رؤية 2030 سوق العمل السعودي وتخلق فرصاً جديدة وتشكل مستقبل التوظيف.',
    content: `The Saudi Vision 2030 initiative represents one of the most ambitious economic transformation programs in the Middle East. This comprehensive roadmap is fundamentally reshaping the job market, creating unprecedented opportunities and challenges.

Economic Diversification Beyond Oil
Saudi Arabia's economy has historically relied heavily on oil production. Vision 2030 aims to diversify the economy significantly. This shift is creating demand for workers in renewable energy, tourism, entertainment, technology, and financial services. Companies in these sectors are actively recruiting specialists, creating a competitive job market that rewards skilled workers.

The Gig Economy and Digital Employment
Digital transformation is accelerating employment opportunities. Freelancing platforms, remote work, and digital entrepreneurship have become mainstream. More companies are adopting hybrid work models, allowing talent from across the region to contribute. This flexibility increases opportunities for specialized professionals.

Skills Gap and Education Focus
While opportunities abound, there's a significant skills gap. The Kingdom is investing heavily in education and vocational training to bridge this gap. STEM fields, data science, artificial intelligence, and digital marketing are in high demand. Workers who upskill themselves have exceptional career prospects.

The Role of Saudi Nationals (Saudization)
Saudization policies continue to create opportunities for local talent. Companies are required to employ Saudi nationals in various positions, creating a favorable job market for qualified Saudi workers. This initiative has proven successful in reducing unemployment and increasing economic participation.

Women in the Saudi Workforce
One of the most significant changes under Vision 2030 is the expansion of women's participation in the workforce. Restrictions have been lifted on various professions, and women now work in construction, driving, aviation, and law enforcement. This has expanded the talent pool and created diverse career opportunities.`,
    contentAr: `مبادرة رؤية المملكة 2030 تمثل أحد أطموح برامج التحول الاقتصادي في الشرق الأوسط. هذه الخارطة الطريق الشاملة تعيد تشكيل سوق العمل بشكل جذري، مما يخلق فرصاً وتحديات غير مسبوقة.

التنويع الاقتصادي وراء النفط
اعتمدت اقتصاديات المملكة تاريخياً بشكل كبير على إنتاج النفط. تهدف رؤية 2030 إلى تنويع الاقتصاد بشكل كبير. يخلق هذا التحول طلباً على العاملين في الطاقة المتجددة والسياحة والترفيه والتكنولوجيا والخدمات المالية. تقوم الشركات في هذه القطاعات بتوظيف متخصصين بنشاط، مما يخلق سوق عمل تنافسي يكافئ العاملين الماهرين.

الاقتصاد الرقمي والعمل عن بعد
يعجل التحول الرقمي فرص العمل. أصبحت منصات العمل الحر والعمل عن بعد وريادة الأعمال الرقمية السائدة. تتبنى المزيد من الشركات نماذج عمل هجينة، مما يسمح للمواهب من جميع أنحاء المنطقة بالمساهمة. تزيد هذه المرونة من الفرص المتاحة للمتخصصين.

فجوة المهارات والتركيز على التعليم
في حين أن الفرص كثيرة، إلا أن هناك فجوة مهارات كبيرة. تستثمر المملكة بشكل كبير في التعليم والتدريب المهني لسد هذه الفجوة. مجالات العلوم والتكنولوجيا والهندسة والرياضيات وعلوم البيانات والذكاء الاصطناعي والتسويق الرقمي في طلب عالي جداً. لدى العاملين الذين يطورون مهاراتهم احتمالات مهنية استثنائية.`,
    author: 'Dr. Fatima Al-Rashid',
    date: '2025-01-20',
    category: 'Economic Trends',
    readTime: 8,
  },
  {
    id: 'sports-job-opportunities',
    title: 'Sports Industry Jobs: Saudi Arabia\'s Growing Sector',
    titleAr: 'وظائف صناعة الرياضة: القطاع المتنامي في المملكة',
    excerpt: 'Discover the explosive growth in sports-related employment across Saudi Arabia, from coaching to sports management and fitness.',
    excerptAr: 'اكتشف النمو المتسارع في فرص العمل المرتبطة بالرياضة في جميع أنحاء المملكة، من التدريب إلى إدارة الرياضة واللياقة البدنية.',
    content: `Saudi Arabia's sports sector is experiencing unprecedented growth, creating thousands of new job opportunities. This expansion is driven by increased government investment, international sporting events, and a growing focus on health and fitness among the population.

The Impact of Mega-Events
Hosting major international sports events has catalyzed job creation. The 2034 FIFA World Cup bid, the Saudi International golf tournaments, and numerous esports competitions require vast teams of professionals. Event management, sports marketing, ticketing, hospitality, and security roles are all in high demand.

Fitness and Wellness Industry Boom
Health consciousness is rising across the Kingdom. Gyms, fitness centers, and wellness facilities are multiplying. This growth creates demand for fitness trainers, nutrition specialists, personal training coaches, and wellness consultants. Many are earning competitive salaries in this thriving sector.

Professional Coaching Opportunities
Academies and training centers throughout Saudi Arabia need experienced coaches in football, basketball, volleyball, swimming, and martial arts. Qualified coaches from around the world are being recruited to develop Saudi talent. This is particularly significant as the Kingdom invests in youth sports development.

Sports Administration and Management
Behind every successful sports organization is a team of administrators and managers. This includes sports event organizers, facility managers, sports marketing professionals, and compliance officers. These roles offer career advancement and excellent remuneration.

Women in Sports
Breaking new ground, women are increasingly entering sports professions. Female coaches, sports psychologists, and fitness trainers are in demand. This represents a significant shift in employment opportunities for Saudi women.`,
    contentAr: `يشهد قطاع الرياضة السعودي نمواً غير مسبوق، مما يخلق آلاف فرص العمل الجديدة. يحركها الاستثمار الحكومي المتزايد والأحداث الرياضية الدولية والتركيز المتنامي على الصحة واللياقة البدنية بين السكان.

تأثير الأحداث الكبرى
استضافة أحداث رياضية دولية رئيسية حفزت خلق فرص عمل. يتطلب عرض كأس العالم 2034 وبطولات الجولف السعودية الدولية وعدد لا يحصى من مسابقات الرياضات الإلكترونية فرقاً ضخمة من المحترفين. إدارة الأحداث والتسويق الرياضي والتذاكر والضيافة والأمان كلها في طلب عالي.

طفرة صناعة اللياقة والعافية
تتزايد الوعي الصحي عبر المملكة. الصالات الرياضية ومراكز اللياقة البدنية وآلات الصحة تتضاعف. يخلق هذا النمو طلباً على مدربي اللياقة والمتخصصين في التغذية ومدربي التدريب الشخصي واستشاريي العافية. يحقق الكثيرون رواتب تنافسية في هذا القطاع المزدهر.

فرص التدريب المهني
تحتاج الأكاديميات ومراكز التدريب في جميع أنحاء المملكة السعودية إلى مدربين ذوي خبرة في كرة القدم وكرة السلة والكرة الطائرة والسباحة والفنون القتالية. يتم تجنيد المدربين المؤهلين من جميع أنحاء العالم لتطوير المواهب السعودية.`,
    author: 'Ahmed Al-Mansouri',
    date: '2025-01-15',
    category: 'Sports Industry',
    readTime: 7,
  },
  {
    id: 'tech-jobs-saudi',
    title: 'Tech Jobs: Saudi Arabia\'s Digital Revolution',
    titleAr: 'وظائف التكنولوجيا: الثورة الرقمية في المملكة',
    excerpt: 'Explore the booming technology sector in Saudi Arabia, from software development to AI and cybersecurity positions.',
    excerptAr: 'استكشف قطاع التكنولوجيا المزدهر في المملكة، من تطوير البرامج إلى الذكاء الاصطناعي وفرص الأمن السيبراني.',
    content: `Saudi Arabia is undergoing a digital transformation that's creating unprecedented opportunities in technology. From artificial intelligence to blockchain, the Kingdom is investing heavily in digital infrastructure and attracting top tech talent.

Software Development Demand
Demand for software developers is skyrocketing. Companies are seeking full-stack developers, mobile app developers, and backend engineers. Salaries are competitive, and remote work opportunities are abundant. Saudi Arabia is becoming a hub for regional tech talent.

Artificial Intelligence and Data Science
AI and machine learning specialists are among the most sought-after professionals. Banks, healthcare providers, and government agencies are implementing AI solutions. Data scientists can command premium salaries in this fast-growing field.

Cybersecurity Professionals
As digital transformation accelerates, cybersecurity becomes critical. Ethical hackers, security analysts, and compliance officers are in high demand. The Saudi government's investment in cybersecurity infrastructure creates numerous opportunities.

Startup Ecosystem
Saudi Arabia's startup ecosystem is thriving. Venture capital is flowing, and entrepreneurs are launching innovative companies. This creates opportunities for developers, designers, product managers, and business development specialists.

Government Digital Initiatives
ARAMCO, the Public Investment Fund, and various government agencies are driving digital transformation initiatives. These mega-projects require significant technical talent, creating employment at scale.`,
    contentAr: `تشهد المملكة العربية السعودية تحولاً رقمياً يخلق فرصاً غير مسبوقة في التكنولوجيا. من الذكاء الاصطناعي إلى البلوكتشين، تستثمر المملكة بكثافة في البنية التحتية الرقمية وجذب أفضل المواهب التقنية.

الطلب على تطوير البرامج
الطلب على مطوري البرامج آخذ في الارتفاع. تسعى الشركات إلى مطوري كاملة المكدس ومطوري تطبيقات الهاتف المحمول ومهندسي الخادم. الرواتب تنافسية، وفرص العمل عن بعد وفيرة.

الذكاء الاصطناعي وعلوم البيانات
متخصصو الذكاء الاصطناعي وتعلم الآلة من بين المهنيين الأكثر طلباً. تقوم البنوك وموفري الرعاية الصحية والوكالات الحكومية بتنفيذ حلول الذكاء الاصطناعي. يمكن لعلماء البيانات أن يطالبوا برواتب ممتازة في هذا المجال سريع النمو.`,
    author: 'Mohammad Al-Johani',
    date: '2025-01-10',
    category: 'Technology',
    readTime: 6,
  },
]

const querySchema = z.object({ search: z.string().max(200).optional() })

export async function GET(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rl = rateLimit(`blog:${ip}`, { limit: 60, windowMs: 60_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } })
    }

    const url = new URL(request.url)
    const parsed = querySchema.safeParse({ search: url.searchParams.get('search') || undefined })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }

    const term = parsed.data.search?.toLowerCase().trim()
    const posts = term
      ? BLOG_POSTS.filter((p) =>
          [p.title, p.titleAr, p.excerpt, p.excerptAr].some((field) => field.toLowerCase().includes(term))
        )
      : BLOG_POSTS

    return NextResponse.json(
      { posts },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { posts: BLOG_POSTS },
      { status: 200 }
    )
  }
}
