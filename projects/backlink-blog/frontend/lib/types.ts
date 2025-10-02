export interface Backlink {
  id: string
  url: string
  anchorText: string
  targetSite: string
  nofollow: boolean
  openInNewTab: boolean
  createdAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  backlinks: Backlink[]
  tags: string[]
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'published'
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
}