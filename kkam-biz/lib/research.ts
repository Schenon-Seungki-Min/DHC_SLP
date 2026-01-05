import { callClaude } from './claude';
import type { ResearchData, Trend, Source } from './types';

export async function conductResearch(apiKey: string, topic: string): Promise<ResearchData> {
  const prompt = `당신은 트렌드 리서치 전문가입니다. 다음 주제에 대해 심층적인 트렌드 분석을 수행해주세요.

주제: ${topic}

아래 형식으로 JSON 응답을 제공해주세요:

{
  "trends": [
    {
      "title": "트렌드 제목",
      "description": "트렌드에 대한 상세 설명 (2-3문장)",
      "importance": "high|medium|low",
      "keywords": ["키워드1", "키워드2", "키워드3"]
    }
  ],
  "insights": [
    "시사점 1",
    "시사점 2",
    "시사점 3"
  ],
  "sources": [
    {
      "url": "https://example.com/article",
      "title": "참고 자료 제목",
      "reliability": "high|medium|low"
    }
  ]
}

요구사항:
1. 최소 3개 이상의 주요 트렌드를 식별해주세요
2. 각 트렌드는 구체적이고 실행 가능한 인사이트를 포함해야 합니다
3. 최신 정보를 기반으로 작성해주세요 (2024-2025년 기준)
4. 각 트렌드의 중요도를 평가해주세요
5. 신뢰할 수 있는 출처를 제공해주세요 (실제 또는 대표적인 출처)
6. 시사점은 실무에서 바로 활용할 수 있는 내용으로 작성해주세요

반드시 유효한 JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요.`;

  try {
    const response = await callClaude(apiKey, prompt);

    // JSON 응답 파싱
    // Claude가 마크다운 코드 블록으로 감쌀 수 있으므로 이를 처리
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const data = JSON.parse(jsonText) as ResearchData;

    // 데이터 유효성 검증
    if (!data.trends || !Array.isArray(data.trends) || data.trends.length === 0) {
      throw new Error('Invalid research data: trends are required');
    }
    if (!data.insights || !Array.isArray(data.insights)) {
      throw new Error('Invalid research data: insights are required');
    }
    if (!data.sources || !Array.isArray(data.sources)) {
      throw new Error('Invalid research data: sources are required');
    }

    return data;
  } catch (error) {
    console.error('Research error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to conduct research'
    );
  }
}
