import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog - Share Industry Insights & Expertise',
  description: 'Professional blog platform for sharing industry insights, expertise, and valuable content with strategic backlink management for business growth.',
  keywords: 'blog, content marketing, industry insights, professional blogging, backlinks, thought leadership',
  openGraph: {
    title: 'Professional Blog Platform',
    description: 'Share your expertise and grow your business presence',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}