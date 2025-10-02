import { BlogPost, Backlink } from './types'
import { samplePosts } from './sample-data'

const STORAGE_KEY = 'backlink_blog_posts'

export const storage = {
  getPosts: (): BlogPost[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      let posts = stored ? JSON.parse(stored) : []
      
      console.log('Storage check - stored data:', stored ? stored.length : 'no data')
      console.log('Storage check - parsed posts:', posts.length)
      console.log('Storage check - sample posts available:', samplePosts.length)
      
      // If no posts exist, populate with sample data
      if (posts.length === 0 && samplePosts.length > 0) {
        console.log('Initializing with sample data...')
        localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts))
        posts = samplePosts
        console.log('Sample data initialized, posts count:', posts.length)
      }
      
      return posts
    } catch (error) {
      console.error('Error loading posts from storage:', error)
      // If there's an error, return sample data and try to save it
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts))
      } catch (saveError) {
        console.error('Error saving sample data:', saveError)
      }
      return samplePosts
    }
  },

  // Add a method to force initialize sample data
  initializeSampleData: (): void => {
    if (typeof window !== 'undefined') {
      console.log('Force initializing sample data...')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts))
      console.log('Sample data force initialized')
    }
  },

  savePost: (post: BlogPost): void => {
    const posts = storage.getPosts()
    const existingIndex = posts.findIndex(p => p.id === post.id)
    
    if (existingIndex >= 0) {
      posts[existingIndex] = post
    } else {
      posts.push(post)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  },

  deletePost: (id: string): void => {
    const posts = storage.getPosts()
    const filtered = posts.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },

  getPost: (id: string): BlogPost | null => {
    const posts = storage.getPosts()
    return posts.find(p => p.id === id) || null
  },

  getPostBySlug: (slug: string): BlogPost | null => {
    const posts = storage.getPosts()
    return posts.find(p => p.slug === slug) || null
  }
}