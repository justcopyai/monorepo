export function generateMetaTags(post: {
  title: string
  excerpt: string
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
  slug: string
}) {
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/blog/${post.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}

export function generateStructuredData(post: {
  title: string
  content: string
  publishedAt: Date | null
  updatedAt: Date
  tags: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    keywords: post.tags.join(', '),
    articleBody: post.content.replace(/<[^>]*>/g, ''), // Strip HTML
  }
}