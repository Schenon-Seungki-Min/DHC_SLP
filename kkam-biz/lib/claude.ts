import Anthropic from '@anthropic-ai/sdk';

export async function callClaude(apiKey: string, prompt: string): Promise<string> {
  const client = new Anthropic({
    apiKey,
  });

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Unexpected response format from Claude');
}
