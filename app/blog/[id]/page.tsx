'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ChevronLeft, Loader, Share2, BookOpen } from 'lucide-react'
import { useParams } from 'next/navigation'

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
  category: string
  readTime: number
}

export default function BlogPostPage() {
  const { language } = useLanguage()
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${postId}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data.post)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar activeMode="application" />
        <div className="flex justify-center items-center py-40">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar activeMode="application" />
        <div className="flex justify-center items-center py-40">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'المقالة غير موجودة' : 'Post not found'}
            </h1>
            <Link href="/blog" className="text-blue-600 hover:underline font-semibold">
              {language === 'ar' ? 'العودة للمدونة' : 'Back to blog'}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            <ChevronLeft className="w-4 h-4" />
            {language === 'ar' ? 'العودة للمدونة' : 'Back to blog'}
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category Badge */}
          <div className="mb-6 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">{post.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {language === 'ar' ? post.titleAr : post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-10 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="font-semibold">{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <span>{post.readTime} {language === 'ar' ? 'دقيقة قراءة' : 'min read'}</span>
            </div>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              <Share2 className="w-5 h-5" />
              {language === 'ar' ? 'مشاركة' : 'Share'}
            </button>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-800 leading-8 space-y-6 text-lg">
              {(language === 'ar' ? post.contentAr : post.content)
                .split('\n\n')
                .map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-gray-700 leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}
            </div>
          </div>

          {/* Back to Blog CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              {language === 'ar' ? 'المزيد من المقالات' : 'More Articles'}
            </Link>
          </motion.div>
        </motion.div>
      </article>

      <Footer />
    </div>
  )
}
