// Blog Types

export interface Article {
  _id: string
  title: string
  titleAr: string
  content: string
  contentAr: string
  excerpt: string
  excerptAr: string
  author: string
  authorId: string
  category: string
  categoryAr: string
  tags: string[]
  image?: string
  thumbnail?: string
  published: boolean
  featured: boolean
  views: number
  readTime: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface CreateArticleData {
  title: string
  titleAr: string
  content: string
  contentAr: string
  excerpt: string
  excerptAr: string
  category: string
  categoryAr: string
  tags: string[]
  image?: string
  featured?: boolean
  published?: boolean
}

export interface UpdateArticleData {
  title?: string
  titleAr?: string
  content?: string
  contentAr?: string
  excerpt?: string
  excerptAr?: string
  category?: string
  categoryAr?: string
  tags?: string[]
  image?: string
  featured?: boolean
  published?: boolean
}

export interface ArticleResponse {
  success: boolean
  message?: string
  article?: Article
}

export interface ArticlesListResponse {
  success: boolean
  message?: string
  articles: Article[]
  total: number
  page: number
  limit: number
}

export interface ArticleCategory {
  id: string
  nameAr: string
  nameEn: string
  description?: string
  descriptionAr?: string
}
