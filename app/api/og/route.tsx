import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#fafafa',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontSize: 24,
              color: '#a3a3a3',
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            filippodanesi.com
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 500,
              color: '#171717',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Filippo Danesi
          </h1>
          <p
            style={{
              fontSize: 32,
              color: '#737373',
              margin: 0,
            }}
          >
            SEO & AI Search Strategist
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '32px',
            fontSize: 20,
            color: '#a3a3a3',
          }}
        >
          <span>AEO</span>
          <span>·</span>
          <span>GEO</span>
          <span>·</span>
          <span>LLM Optimization</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
