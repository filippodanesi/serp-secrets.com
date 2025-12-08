import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import MDXComponents from '@/app/components/MDXComponents'

const siteUrl = 'https://www.serp-secrets.com'

function getAboutContent() {
  const filePath = path.join(process.cwd(), 'content', 'pages', 'about.mdx')
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  return { frontmatter: data, content }
}

export const metadata: Metadata = {
  title: 'About',
  description: 'Hey, I\'m Filippo! I work in Zurich as a Content Manager SEO at Triumph International, where I develop content strategies and figure out how AI keeps breaking everything we thought we knew about SEO.',
  alternates: {
    canonical: `${siteUrl}/about/`,
  },
  openGraph: {
    title: 'About ~ SERP Secrets',
    description: 'Hey, I\'m Filippo! I work in Zurich as a Content Manager SEO at Triumph International.',
    url: `${siteUrl}/about/`,
  },
}

export default function About() {
  const { content } = getAboutContent()

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">About</h1>
      </header>

      <div className="section-content">
        <MDXRemote source={content} components={MDXComponents} />
      </div>
    </>
  )
}
