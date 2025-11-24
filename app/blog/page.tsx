'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, ChevronRight, Loader, Sparkles } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  titleAr: string
  excerpt: string
  excerptAr: string
  category: string
  readTime: number
  date: string
}

export default function BlogPage() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="home" />

      {/* Hero Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center text-white"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">{language === 'ar' ? '📊 رؤى المستقبل' : '📊 Future Insights'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {language === 'ar' ? 'مستقبل الوظائف بالمملكة' : 'The Future of Jobs in Saudi Arabia'}
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'استكشف أحدث الاتجاهات والفرص الوظيفية في المملكة العربية السعودية وتأثير رؤية 2030 على سوق العمل'
              : 'Explore the latest trends and job opportunities in Saudi Arabia and the impact of Vision 2030 on the job market'}
          </p>
        </motion.div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="h-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col border border-gray-100 hover:border-purple-200">
                      {/* Header with Category and Icon */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="inline-flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <TrendingUp className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
                        {language === 'ar' ? post.titleAr : post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm sm:text-base mb-6 flex-1 line-clamp-3 leading-relaxed">
                        {language === 'ar' ? post.excerptAr : post.excerpt}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            📅 {new Date(post.date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            ⏱ {post.readTime} {language === 'ar' ? 'دقيقة' : 'min'}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'ar' ? 'قريباً' : 'Coming Soon'}
              </h3>
              <p className="text-gray-600 text-lg">
                {language === 'ar'
                  ? 'نعمل على إعداد محتوى متميز عن مستقبل الوظائف'
                  : 'We are preparing excellent content about the future of jobs'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'هل تريد أن تبقى على اطلاع؟' : 'Want to Stay Updated?'}
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            {language === 'ar'
              ? 'تابع المدونة للحصول على أحدث الرؤى والفرص الوظيفية'
              : 'Follow our blog for the latest insights and job opportunities'}
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
