'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, User, ChevronRight, Loader } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  titleAr: string
  excerpt: string
  excerptAr: string
  content: string
  contentAr: string
  author: string
  date: string
  image: string
  category: string
  readTime: number
}

export default function BlogPage() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
        } else {
          setPosts([])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  const uniqueCategories = Array.from(new Set(posts.map(p => p.category)))
  const categories = ['all', ...uniqueCategories]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="blog" />

      {/* Hero Section */}
      <section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-blue-600 to-blue-500">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center text-white"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            {language === 'ar' ? '📰 مدونة TF1' : '📰 TF1 Blog'}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اكتشف أحدث الأخبار والنصائح والدروس من عالم الرياضة'
              : 'Discover latest news, tips, and lessons from the sports world'}
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      {!loading && posts.length > 0 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {language === 'ar'
                    ? cat === 'all'
                      ? 'الكل'
                      : cat
                    : cat === 'all'
                    ? 'All'
                    : cat}
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
                        <Image
                          src={post.image}
                          alt={language === 'ar' ? post.titleAr : post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 sm:right-auto sm:left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {post.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {language === 'ar' ? post.titleAr : post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
                          {language === 'ar' ? post.excerptAr : post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 mt-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              ⏱ {post.readTime} {language === 'ar' ? 'دقيقة' : 'min'}
                            </span>
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                          {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'ar' ? 'لا توجد مقالات' : 'No articles yet'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'تحقق من الإصدارات القادمة'
                  : 'Check back soon for new content'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
