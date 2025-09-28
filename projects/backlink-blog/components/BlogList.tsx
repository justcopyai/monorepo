'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BlogPost } from '@/lib/types'
import { Edit, Trash2, Link, Calendar, Tag, Eye, ArrowUpRight, Sparkles } from 'lucide-react'
import { format } from 'date-fns'

interface BlogListProps {
  posts: BlogPost[]
  onView: (post: BlogPost) => void
}

export function BlogList({ posts, onView }: BlogListProps) {
  const publishedPosts = posts.filter(p => p.status === 'published')

  const PostCard = ({ post, index }: { post: BlogPost; index: number }) => (
    <div 
      className="group relative cursor-pointer"
      onClick={() => onView(post)}
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group-hover:bg-white/90">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors">
                  {post.title}
                </CardTitle>
                {post.backlinks.length > 0 && (
                  <div className="flex items-center">
                    <Link className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600 ml-1">
                      {post.backlinks.length}
                    </span>
                  </div>
                )}
              </div>
              <CardDescription className="text-gray-600 leading-relaxed">
                {post.excerpt || 'No excerpt available'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {post.publishedAt 
                      ? format(new Date(post.publishedAt), 'MMM dd, yyyy')
                      : format(new Date(post.createdAt), 'MMM dd, yyyy')
                    }
                  </span>
                </div>
                
                {post.backlinks.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Link className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-600 font-medium">{post.backlinks.length} links</span>
                  </div>
                )}
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-400" />
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                )}
              </div>
            )}

            {post.backlinks.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <p className="text-xs font-semibold text-purple-800">Strategic Backlinks</p>
                </div>
                <div className="space-y-1">
                  {post.backlinks.slice(0, 2).map(backlink => (
                    <div key={backlink.id} className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 truncate flex-1 mr-2">
                        {backlink.anchorText}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-24">
                        {backlink.targetSite}
                      </span>
                    </div>
                  ))}
                  {post.backlinks.length > 2 && (
                    <p className="text-xs text-purple-600 font-medium">
                      +{post.backlinks.length - 2} more backlinks
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>

      </Card>
    </div>
  )

  return (
    <div className="space-y-12">
      {publishedPosts.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Articles
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {publishedPosts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {publishedPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </section>
      )}

      {publishedPosts.length === 0 && (
        <div className="text-center py-20">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Create Something Amazing?</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start building your content empire with strategic articles that drive real business results.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Create SEO-optimized content</p>
            <p>• Add strategic backlinks</p>
            <p>• Build domain authority</p>
          </div>
        </div>
      )}
    </div>
  )
}