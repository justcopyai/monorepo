'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogPost, Backlink } from '@/lib/types'
import { Plus, Trash2, Link, Save, ArrowLeft } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface BlogEditorProps {
  postId?: string
  onSave?: (post: BlogPost) => void
  onCancel?: () => void
}

export function BlogEditor({ postId, onSave, onCancel }: BlogEditorProps) {
  const [post, setPost] = useState<BlogPost>({
    id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    backlinks: [],
    tags: [],
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    seoTitle: '',
    seoDescription: ''
  })

  const [newBacklink, setNewBacklink] = useState<Partial<Backlink>>({
    url: '',
    anchorText: '',
    targetSite: '',
    nofollow: false,
    openInNewTab: true
  })

  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (!postId) {
      setPost(prev => ({ ...prev, id: uuidv4() }))
    }
    // In demo mode, we don't load existing posts
  }, [postId])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seoTitle: prev.seoTitle || title
    }))
  }

  const addBacklink = () => {
    if (newBacklink.url && newBacklink.anchorText) {
      const backlink: Backlink = {
        id: uuidv4(),
        url: newBacklink.url,
        anchorText: newBacklink.anchorText,
        targetSite: newBacklink.targetSite || new URL(newBacklink.url).hostname,
        nofollow: newBacklink.nofollow || false,
        openInNewTab: newBacklink.openInNewTab !== false,
        createdAt: new Date()
      }

      setPost(prev => ({
        ...prev,
        backlinks: [...prev.backlinks, backlink]
      }))

      setNewBacklink({
        url: '',
        anchorText: '',
        targetSite: '',
        nofollow: false,
        openInNewTab: true
      })
    }
  }

  const removeBacklink = (id: string) => {
    setPost(prev => ({
      ...prev,
      backlinks: prev.backlinks.filter(bl => bl.id !== id)
    }))
  }

  const addTag = () => {
    if (tagInput && !post.tags.includes(tagInput)) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSave = (status: 'draft' | 'published') => {
    const updatedPost = {
      ...post,
      status,
      updatedAt: new Date(),
      publishedAt: status === 'published' ? new Date() : post.publishedAt
    }
    
    storage.savePost(updatedPost)
    
    if (onSave) {
      onSave(updatedPost)
    }
  }

  const insertBacklinkInContent = (backlink: Backlink) => {
    const linkHtml = `<a href="${backlink.url}" ${backlink.nofollow ? 'rel="nofollow"' : ''} ${backlink.openInNewTab ? 'target="_blank"' : ''}>${backlink.anchorText}</a>`
    setPost(prev => ({
      ...prev,
      content: prev.content + '\n' + linkHtml
    }))
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {postId ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={handleTitleChange}
                  placeholder="Enter your blog title"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={post.slug}
                  onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of your post"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={post.content}
                  onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog content here... (HTML supported)"
                  rows={15}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={post.seoTitle}
                  onChange={(e) => setPost(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={post.seoDescription}
                  onChange={(e) => setPost(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="Meta description for search engines"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backlinks Manager</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="URL"
                  value={newBacklink.url}
                  onChange={(e) => setNewBacklink(prev => ({ ...prev, url: e.target.value }))}
                />
                <Input
                  placeholder="Anchor text"
                  value={newBacklink.anchorText}
                  onChange={(e) => setNewBacklink(prev => ({ ...prev, anchorText: e.target.value }))}
                />
                <Input
                  placeholder="Target site (optional)"
                  value={newBacklink.targetSite}
                  onChange={(e) => setNewBacklink(prev => ({ ...prev, targetSite: e.target.value }))}
                />
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBacklink.nofollow}
                      onChange={(e) => setNewBacklink(prev => ({ ...prev, nofollow: e.target.checked }))}
                      className="mr-2"
                    />
                    Nofollow
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBacklink.openInNewTab !== false}
                      onChange={(e) => setNewBacklink(prev => ({ ...prev, openInNewTab: e.target.checked }))}
                      className="mr-2"
                    />
                    Open in new tab
                  </label>
                </div>
                <Button onClick={addBacklink} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Backlink
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Current Backlinks ({post.backlinks.length})</Label>
                {post.backlinks.map((backlink) => (
                  <div key={backlink.id} className="p-3 border rounded-md space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{backlink.anchorText}</p>
                        <p className="text-xs text-muted-foreground truncate">{backlink.url}</p>
                        <div className="flex gap-2 mt-1">
                          {backlink.nofollow && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">nofollow</span>
                          )}
                          {backlink.openInNewTab && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">new tab</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => insertBacklinkInContent(backlink)}
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeBacklink(backlink.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button onClick={() => handleSave('published')} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Publish Post
            </Button>
            <Button onClick={() => handleSave('draft')} variant="outline" className="w-full">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}