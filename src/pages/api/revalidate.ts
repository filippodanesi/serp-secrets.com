import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verifica token di sicurezza (opzionale ma consigliato)
    const authHeader = request.headers.get('authorization');
    const expectedToken = import.meta.env.REVALIDATE_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const body = await request.json();
    const { post_slug, action } = body;
    
    console.log(`🔄 Revalidation triggered for: ${post_slug || 'all content'}`);
    
    // In un setup ISR reale, qui triggereresti la revalidation
    // Per ora, questo endpoint serve come webhook receiver
    
    // Log dell'azione
    const logData = {
      timestamp: new Date().toISOString(),
      action: action || 'publish',
      post_slug: post_slug || 'unknown',
      source: 'wordpress'
    };
    
    console.log('📝 Revalidation log:', logData);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Revalidation triggered',
      data: logData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Revalidation failed'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 