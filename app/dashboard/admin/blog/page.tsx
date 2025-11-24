'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import blogService from '@/services/blog'
import type { Article } from '@/types/blog'

export default function AdminBlogPage() {
  const { language, t } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError('')
      const { articles } = await blogService.getArticles({ limit: 100 })
      setArticles(articles)
    } catch (err: any) {
      setError(err.message || 'خطأ في تحميل المقالات')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'ar' ? 'هل تريد حذف هذه المقالة؟' : 'Delete this article?')) return
    
    try {
      await blogService.deleteArticle(id)
      setArticles(articles.filter(a => a._id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleTogglePublish = async (article: Article) => {
    try {
      const updated = article.published 
        ? await blogService.unpublishArticle(article._id)
        : await blogService.publishArticle(article._id)
      setArticles(articles.map(a => a._id === article._id ? updated : a))
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'إدارة المقالات' : 'Manage Articles'}
            </h1>
            <p className="text-gray-600 mt-2">
              {language === 'ar' ? 'أنشئ وأدِر مقالات المدونة' : 'Create and manage blog articles'}
            </p>
          </div>
          <Link href="/dashboard/admin/blog/create">
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'مقالة جديدة' : 'New Article'}
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Articles Table */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">
              {language === 'ar' ? 'لا توجد مقالات' : 'No articles yet'}
            </p>
            <Link href="/dashboard/admin/blog/create">
              <Button>{language === 'ar' ? 'أنشئ مقالة' : 'Create Article'}</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'العنوان' : 'Title'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'الفئة' : 'Category'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'المشاهدات' : 'Views'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {language === 'ar' ? article.titleAr : article.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(article.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {language === 'ar' ? article.categoryAr : article.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          article.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {article.published ? (language === 'ar' ? 'منشور' : 'Published') : (language === 'ar' ? 'مسودة' : 'Draft')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {article.views}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTogglePublish(article)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title={article.published ? 'Unpublish' : 'Publish'}
                          >
                            {article.published ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <Link href={`/dashboard/admin/blog/edit/${article._id}`}>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(article._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
