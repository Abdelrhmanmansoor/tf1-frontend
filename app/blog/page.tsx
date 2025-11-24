'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import blogService from '@/services/blog'
import type { Article } from '@/types/blog'

export default function BlogPage() {
  const { language } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const { articles } = await blogService.getArticles({ 
        published: true,
        limit: 50 
      })
      setArticles(articles)
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    const title = language === 'ar' ? article.titleAr : article.title
    const matchesSearch = !searchQuery || title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(
    new Set(articles.map(a => a.category))
  ).filter(Boolean)

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar activeMode="application" activePage="blog" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'المدونة' : 'Blog'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اكتشف أحدث المقالات والنصائح الرياضية' 
              : 'Discover latest articles and sports tips'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'ابحث عن مقالات...' : 'Search articles...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg font-medium">
              {language === 'ar' ? 'لا توجد مقالات متوفرة' : 'No articles available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <Link key={article._id} href={`/blog/${article._id}`}>
                <article className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
                  {article.thumbnail ? (
                    <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-cyan-400">
                      <img
                        src={article.thumbnail}
                        alt={language === 'ar' ? article.titleAr : article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-cyan-400" />
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      {language === 'ar' ? article.titleAr : article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {language === 'ar' ? article.excerptAr : article.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <span className="font-medium">{article.readTime} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                      <span>{article.views} {language === 'ar' ? 'عرض' : 'views'}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
