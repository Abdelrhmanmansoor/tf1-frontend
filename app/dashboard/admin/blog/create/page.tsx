'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { ArticleForm } from '@/components/blog/article-form'
import blogService from '@/services/blog'
import type { CreateArticleData } from '@/types/blog'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function CreateArticlePage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: CreateArticleData | any) => {
    try {
      setIsLoading(true)
      setError('')
      await blogService.createArticle(data as CreateArticleData)
      alert(language === 'ar' ? 'تم إنشاء المقالة بنجاح!' : 'Article created successfully!')
      router.push('/dashboard/admin/blog')
    } catch (err: any) {
      setError(err.message || (language === 'ar' ? 'خطأ في إنشاء المقالة' : 'Error creating article'))
    } finally {
      setIsLoading(false)
    }
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
            {language === 'ar' ? 'مقالة جديدة' : 'New Article'}
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
          <ArticleForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
