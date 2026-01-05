import { NextRequest, NextResponse } from 'next/server';
import { generateExcel } from '@/lib/excel-generator';
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

    const buffer = await generateExcel(researchData, topic);

    // 파일명 생성
    const filename = `트렌드_데이터_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Response 생성 - Buffer를 Uint8Array로 변환
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (error) {
    console.error('Excel generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate Excel',
      },
      { status: 500 }
    );
  }
}
