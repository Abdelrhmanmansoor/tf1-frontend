'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { ArticleForm } from '@/components/blog/article-form'
import blogService from '@/services/blog'
import type { UpdateArticleData, Article } from '@/types/blog'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const { language } = useLanguage()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadArticle()
  }, [params.id])

  const loadArticle = async () => {
    try {
      setIsFetching(true)
      const data = await blogService.getArticle(params.id as string)
      setArticle(data)
    } catch (err: any) {
      setError(err.message || (language === 'ar' ? 'خطأ في تحميل المقالة' : 'Error loading article'))
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (data: UpdateArticleData) => {
    try {
      setIsLoading(true)
      setError('')
      await blogService.updateArticle(params.id as string, data)
      alert(language === 'ar' ? 'تم تحديث المقالة بنجاح!' : 'Article updated successfully!')
      router.push('/dashboard/admin/blog')
    } catch (err: any) {
      setError(err.message || (language === 'ar' ? 'خطأ في تحديث المقالة' : 'Error updating article'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || (language === 'ar' ? 'المقالة غير موجودة' : 'Article not found')}</p>
          <Link href="/dashboard/admin/blog">
            <Button>{language === 'ar' ? 'العودة' : 'Back'}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/admin/blog">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              {language === 'ar' ? 'العودة' : 'Back'}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ar' ? 'تعديل المقالة' : 'Edit Article'}
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <ArticleForm article={article} onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
