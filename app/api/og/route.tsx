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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 60,
              fontWeight: 500,
              color: '#171717',
              margin: 0,
              marginBottom: 24,
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
            SEO & AI Search Strategist (AEO/GEO)
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
