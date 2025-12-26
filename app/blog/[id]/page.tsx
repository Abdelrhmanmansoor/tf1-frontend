'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Loader2, ArrowLeft, Share2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import blogService from '@/services/blog'
import type { Article } from '@/types/blog'

export default function BlogPostPage() {
  const { language } = useLanguage()
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadArticle()
  }, [params.id])

  const loadArticle = async () => {
    try {
      setLoading(true)
      const data = await blogService.getArticle(params.id as string)
      setArticle(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar activeMode="application" activePage="blog" />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'المقالة غير موجودة' : 'Article not found'}
          </h1>
          <Link href="/blog" className="text-blue-600 hover:underline font-semibold">
            {language === 'ar' ? 'العودة للمدونة' : 'Back to blog'}
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const content = language === 'ar' ? article.contentAr : article.content
  const title = language === 'ar' ? article.titleAr : article.title

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar activeMode="application" activePage="blog" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            {language === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {article.category}
            </span>
            {article.featured && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {language === 'ar' ? 'مميز' : 'Featured'}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <span>{article.readTime} {language === 'ar' ? 'دقيقة قراءة' : 'min read'}</span>
              <span>{article.views} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
            </div>
            <span className="text-sm">
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                language === 'ar' ? 'ar-SA' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </span>
          </div>
        </header>

        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.thumbnail}
              alt={title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div className="bg-white p-8 rounded-lg">
            {content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8 py-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Link key={tag} href={`/blog?search=${tag}`}>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="py-6 border-t border-gray-200 flex items-center gap-4">
          <span className="text-gray-600">{language === 'ar' ? 'شارك المقالة:' : 'Share article:'}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title, url: window.location.href })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied')
              }
            }}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            {language === 'ar' ? 'مشاركة' : 'Share'}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
