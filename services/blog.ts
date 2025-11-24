/* eslint-disable no-unused-vars */

// Blog API Service
import api from './api'
import type {
  Article,
  CreateArticleData,
  UpdateArticleData,
  ArticleResponse,
  ArticlesListResponse,
} from '@/types/blog'

class BlogService {
  private BASE_PATH = '/blog/articles'

  private handleError(error: any) {
    if (error.response?.status === 401) {
      throw new Error('غير مصرح - يجب تسجيل الدخول أولاً')
    }
    if (error.response?.status === 403) {
      throw new Error('ليس لديك صلاحيات كافية')
    }
    if (error.response?.status === 404) {
      throw new Error('المقالة غير موجودة')
    }
    if (error.response?.status === 409) {
      throw new Error('المقالة موجودة بالفعل')
    }
    throw error
  }

  // Create Article
  async createArticle(data: CreateArticleData): Promise<Article> {
    try {
      const response = await api.post<ArticleResponse>(`${this.BASE_PATH}`, data)
      if (!response.data.article) throw new Error('Failed to create article')
      return response.data.article
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Get All Articles
  async getArticles(params?: {
    page?: number
    limit?: number
    category?: string
    published?: boolean
    search?: string
  }): Promise<{ articles: Article[]; total: number }> {
    try {
      const response = await api.get<ArticlesListResponse>(`${this.BASE_PATH}`, {
        params,
      })
      return {
        articles: response.data.articles || [],
        total: response.data.total || 0,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Get Single Article
  async getArticle(articleId: string): Promise<Article> {
    try {
      const response = await api.get<ArticleResponse>(`${this.BASE_PATH}/${articleId}`)
      if (!response.data.article) throw new Error('Article not found')
      return response.data.article
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Update Article
  async updateArticle(articleId: string, data: UpdateArticleData): Promise<Article> {
    try {
      const response = await api.patch<ArticleResponse>(
        `${this.BASE_PATH}/${articleId}`,
        data
      )
      if (!response.data.article) throw new Error('Failed to update article')
      return response.data.article
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Delete Article
  async deleteArticle(articleId: string): Promise<void> {
    try {
      await api.delete(`${this.BASE_PATH}/${articleId}`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Publish Article
  async publishArticle(articleId: string): Promise<Article> {
    try {
      const response = await api.post<ArticleResponse>(
        `${this.BASE_PATH}/${articleId}/publish`
      )
      if (!response.data.article) throw new Error('Failed to publish article')
      return response.data.article
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Unpublish Article
  async unpublishArticle(articleId: string): Promise<Article> {
    try {
      const response = await api.post<ArticleResponse>(
        `${this.BASE_PATH}/${articleId}/unpublish`
      )
      if (!response.data.article) throw new Error('Failed to unpublish article')
      return response.data.article
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Get Featured Articles
  async getFeaturedArticles(limit: number = 5): Promise<Article[]> {
    try {
      const response = await api.get<ArticlesListResponse>(`${this.BASE_PATH}`, {
        params: { featured: true, published: true, limit },
      })
      return response.data.articles || []
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Search Articles
  async searchArticles(query: string): Promise<Article[]> {
    try {
      const response = await api.get<ArticlesListResponse>(`${this.BASE_PATH}`, {
        params: { search: query, published: true },
      })
      return response.data.articles || []
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

const blogService = new BlogService()
export default blogService
