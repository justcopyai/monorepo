'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BlogPost } from '@/lib/types'
import { ArrowLeft, Edit, Calendar, Tag, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

interface BlogViewProps {
  post: BlogPost
  onBack: () => void
}

export function BlogView({ post, onBack }: BlogViewProps) {
  const renderContent = () => {
    return <div dangerouslySetInnerHTML={{ __html: post.content }} />
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className={`px-3 py-1 rounded ${
              post.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {post.status}
            </span>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.publishedAt 
                ? format(new Date(post.publishedAt), 'MMMM dd, yyyy')
                : `Draft created ${format(new Date(post.createdAt), 'MMMM dd, yyyy')}`
              }
            </div>

            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              {post.backlinks.length} backlinks
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.excerpt && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-lg italic">{post.excerpt}</p>
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none mb-8">
          {renderContent()}
        </div>

        {post.backlinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Backlinks in this Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {post.backlinks.map(backlink => (
                  <div key={backlink.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{backlink.anchorText}</p>
                      <a 
                        href={backlink.url} 
                        target="_blank" 
                        rel={backlink.nofollow ? "nofollow noopener" : "noopener"}
                        className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                        {backlink.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="flex gap-2">
                      {backlink.nofollow && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          nofollow
                        </span>
                      )}
                      {backlink.openInNewTab && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          new tab
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {post.seoTitle && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>SEO Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SEO Title</p>
                  <p>{post.seoTitle}</p>
                </div>
                {post.seoDescription && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SEO Description</p>
                    <p>{post.seoDescription}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">URL Slug</p>
                  <p className="font-mono text-sm">{post.slug}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </article>
    </div>
  )
}