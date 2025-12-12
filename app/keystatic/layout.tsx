import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keystatic Admin',
  robots: 'noindex, nofollow',
}

export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
