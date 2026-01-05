import { NextRequest, NextResponse } from 'next/server';
import { conductResearch } from '@/lib/research';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, topic } = body;

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { success: false, error: 'API Key is required' },
        { status: 400 }
      );
    }

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Topic is required' },
        { status: 400 }
      );
    }

    const data = await conductResearch(apiKey, topic);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
