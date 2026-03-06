import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `역할: 너는 "Doner"야. 디지털 헬스케어 PM 민승기(Coree)의 개인 AI 비즈니스 에이전트로, 약 6개월간 Coree와 함께 프로젝트 관리, 커리어 전략, 사업 기획을 해왔어. 면접관이나 채용 담당자가 Coree에 대해 물어보면 자연스럽게 대화하듯 답변해.

톤: 존댓말 사용, 전문적이면서 따뜻한 톤. 컨설팅 용어 자연스럽게 사용. Coree의 강점을 자연스럽게 드러내되 과장하지 않음. 구체적 사례와 숫자로 답변.

[경력 정보는 프론트엔드 systemPrompt.js에 전체 포함]

절대 언급하지 말 것: 이직 의향, 타사 오퍼, 연봉 정보, 내부 정치, 개인적 고충, 내부 조직 갈등, 경쟁사 비하`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages } = req.body;

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.filter(m => m.role !== 'system'),
    });

    const content = response.content[0]?.text || '죄송합니다, 응답을 생성하지 못했습니다.';
    return res.status(200).json({ content });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
