import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

async function loadInter(weight: 400 | 600) {
  const file = weight === 400
    ? 'inter-latin-400-normal.woff2'
    : 'inter-latin-600-normal.woff2'
  return fetch(`https://cdn.jsdelivr.net/npm/@fontsource/inter/files/${file}`)
    .then(r => r.arrayBuffer())
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')

  const [interRegular, interSemiBold] = await Promise.all([
    loadInter(400),
    loadInter(600),
  ])

  const fonts = [
    { name: 'Inter', data: interRegular, weight: 400 as const },
    { name: 'Inter', data: interSemiBold, weight: 600 as const },
  ]

  const Logo = () => (
    <svg width="20" height="20" viewBox="0 0 375 375" fill="#171717">
      <path d="M 196.519531 4.851562 L 178.949219 4.851562 L 178.949219 366.363281 L 196.519531 366.363281 Z" />
      <path d="M 369.726562 176.871094 L 5.769531 176.871094 L 5.769531 194.390625 L 369.726562 194.390625 Z" />
      <path d="M 65.238281 51.628906 L 52.804688 63.988281 L 310.128906 319.609375 L 322.617188 307.242188 Z" />
      <path d="M 310.128906 51.628906 L 52.804688 307.25 L 65.238281 319.566406 L 322.617188 63.980469 Z" />
      <path d="M 22.542969 109.398438 L 15.898438 125.578125 L 352.972656 261.964844 L 359.621094 245.8125 Z" />
      <path d="M 248.296875 15.007812 L 110.96875 349.800781 L 127.273438 356.390625 L 264.601562 21.589844 Z" />
      <path d="M 353.394531 109.992188 L 15.746094 244.964844 L 22.316406 261.199219 L 359.976562 126.226562 Z" />
      <path d="M 127.839844 14.792969 L 111.535156 21.308594 L 247.367188 356.691406 L 263.671875 350.179688 Z" />
    </svg>
  )

  if (title) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderLeft: '3px solid #e5e5e5',
              paddingLeft: '32px',
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#737373',
                margin: 0,
              }}
            >
              Blog
            </p>
            <h1
              style={{
                fontSize: title.length > 60 ? 42 : title.length > 40 ? 48 : 56,
                fontWeight: 600,
                color: '#171717',
                margin: 0,
                lineHeight: 1.3,
                maxWidth: '950px',
              }}
            >
              {title}
            </h1>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '80px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: 14,
              color: '#737373',
            }}
          >
            <Logo />
            <span style={{ color: '#171717', fontWeight: 600 }}>SERP Secrets</span>
            <span style={{ color: '#e5e5e5' }}>·</span>
            <span>serp-secrets.com</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter, sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderLeft: '3px solid #e5e5e5',
            paddingLeft: '32px',
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: '#171717',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            SERP Secrets
          </h1>
          <p
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: '#737373',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Thoughts on SEO, AI, and the future of search.
          </p>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: 14,
            color: '#737373',
          }}
        >
          <Logo />
          <span>serp-secrets.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  )
}
