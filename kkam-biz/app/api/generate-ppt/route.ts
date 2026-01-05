import { NextRequest, NextResponse } from 'next/server';
import { generatePPT } from '@/lib/ppt-generator';
import type { ResearchData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { researchData, topic } = body as { researchData: ResearchData; topic: string };

    if (!researchData || !topic) {
      return NextResponse.json(
        { success: false, error: 'Research data and topic are required' },
        { status: 400 }
      );
    }

    const pptx = generatePPT(researchData, topic);

    // PPT를 Buffer로 변환
    const arrayBuffer = await pptx.write({ outputType: 'arraybuffer' });

    // 파일명 생성
    const filename = `트렌드_요약_${new Date().toISOString().split('T')[0]}.pptx`;

    // Response 생성
    return new NextResponse(arrayBuffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (error) {
    console.error('PPT generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate PPT',
      },
      { status: 500 }
    );
  }
}
