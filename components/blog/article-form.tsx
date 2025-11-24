'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { Article, CreateArticleData, UpdateArticleData } from '@/types/blog'

interface ArticleFormProps {
  article?: Article
  onSubmit: (data: CreateArticleData | UpdateArticleData) => Promise<void>
  isLoading?: boolean
}

const CATEGORIES = [
  { id: 'training', ar: 'التدريب', en: 'Training' },
  { id: 'nutrition', ar: 'التغذية', en: 'Nutrition' },
  { id: 'psychology', ar: 'علم النفس', en: 'Psychology' },
  { id: 'fitness', ar: 'اللياقة', en: 'Fitness' },
  { id: 'news', ar: 'أخبار', en: 'News' },
  { id: 'tips', ar: 'نصائح', en: 'Tips' },
]

export function ArticleForm({ article, onSubmit, isLoading = false }: ArticleFormProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    title: article?.title || '',
    titleAr: article?.titleAr || '',
    content: article?.content || '',
    contentAr: article?.contentAr || '',
    excerpt: article?.excerpt || '',
    excerptAr: article?.excerptAr || '',
    category: article?.category || 'training',
    categoryAr: article?.categoryAr || 'التدريب',
    tags: article?.tags.join(', ') || '',
    featured: article?.featured || false,
    published: article?.published || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    const selected = CATEGORIES.find(c => c.id === value)
    if (selected) {
      setFormData(prev => ({
        ...prev,
        category: selected.en,
        categoryAr: selected.ar,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    await onSubmit(data as any)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* English Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'العنوان (English)' : 'Title (English)'}
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Article title in English"
        />
      </div>

      {/* Arabic Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'العنوان (العربية)' : 'Title (Arabic)'}
        </label>
        <input
          type="text"
          name="titleAr"
          value={formData.titleAr}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="عنوان المقالة"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الفئة' : 'Category'}
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {language === 'ar' ? cat.ar : cat.en}
            </option>
          ))}
        </select>
      </div>

      {/* English Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الملخص (English)' : 'Excerpt (English)'}
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          required
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief summary of the article"
        />
      </div>

      {/* Arabic Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الملخص (العربية)' : 'Excerpt (Arabic)'}
        </label>
        <textarea
          name="excerptAr"
          value={formData.excerptAr}
          onChange={handleChange}
          required
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ملخص المقالة"
        />
      </div>

      {/* English Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'المحتوى (English)' : 'Content (English)'}
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="Full article content in English"
        />
      </div>

      {/* Arabic Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'المحتوى (العربية)' : 'Content (Arabic)'}
        </label>
        <textarea
          name="contentAr"
          value={formData.contentAr}
          onChange={handleChange}
          required
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="محتوى المقالة كاملاً"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الوسوم (مفصولة بفاصلة)' : 'Tags (comma separated)'}
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="training, fitness, tips"
        />
      </div>

      {/* Options */}
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">
            {language === 'ar' ? 'مقالة مميزة' : 'Featured Article'}
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">
            {language === 'ar' ? 'نشر الآن' : 'Publish Now'}
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
          </>
        ) : (
          language === 'ar' ? 'حفظ المقالة' : 'Save Article'
        )}
      </Button>
    </form>
  )
}
