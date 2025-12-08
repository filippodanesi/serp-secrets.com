import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')

  if (title) {
    // Blog post OG image
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
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              borderLeft: '3px solid #e5e5e5',
              paddingLeft: '32px',
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
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
                fontWeight: 500,
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
              gap: '12px',
              fontSize: 18,
              color: '#737373',
            }}
          >
            <span style={{ color: '#171717', fontWeight: 500 }}>SERP Secrets</span>
            <span style={{ color: '#e5e5e5' }}>·</span>
            <span>serp-secrets.com</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }

  // Default site OG image
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
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
              fontWeight: 500,
              color: '#171717',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            SERP Secrets
          </h1>
          <p
            style={{
              fontSize: 24,
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
            gap: '16px',
            fontSize: 16,
            color: '#737373',
          }}
        >
          <span>serp-secrets.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
