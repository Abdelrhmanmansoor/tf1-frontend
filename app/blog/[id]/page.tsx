'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, User, ChevronLeft, Loader, Share2 } from 'lucide-react'
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
  image: string
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
      <div
        className="min-h-screen bg-gray-50"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
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
      <div
        className="min-h-screen bg-gray-50"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <Navbar activeMode="application" />
        <div className="flex justify-center items-center py-40">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'المقالة غير موجودة' : 'Post not found'}
            </h1>
            <Link href="/blog" className="text-blue-600 hover:underline">
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
      className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
            <ChevronLeft className="w-4 h-4" />
            {language === 'ar' ? 'العودة للمدونة' : 'Back to blog'}
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <span className="inline-block bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? post.titleAr : post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="font-semibold">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⏱</span>
                <span>
                  {post.readTime} {language === 'ar' ? 'دقيقة قراءة' : 'min read'}
                </span>
              </div>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                <Share2 className="w-5 h-5" />
                {language === 'ar' ? 'مشاركة' : 'Share'}
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={post.image}
              alt={language === 'ar' ? post.titleAr : post.title}
              width={800}
              height={450}
              className="w-full h-auto"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed space-y-6 text-lg">
              {(language === 'ar' ? post.contentAr : post.content)
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {language === 'ar' ? 'العودة للمدونة' : 'Back to blog'}
            </Link>
          </div>
        </motion.div>
      </article>

      <Footer />
    </div>
  )
}
