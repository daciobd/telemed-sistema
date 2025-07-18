import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.0.0',
      uptime: process.uptime(),
      features: {
        ai_assistant: process.env.FEATURE_AI_ASSISTANT === 'true',
        video_calls: process.env.FEATURE_VIDEO_CALLS === 'true',
      },
      system: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      database: {
        connected: !!process.env.DATABASE_URL,
        url_provided: !!process.env.DATABASE_URL,
      },
    };

    return NextResponse.json(healthData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
  }
}