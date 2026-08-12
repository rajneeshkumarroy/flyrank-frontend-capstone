import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

const SYSTEM_PROMPT = `
You are the FlyRank Frontend AI Engineering internship assistant.

Help the user with:

- React
- JavaScript
- TypeScript
- frontend development
- accessibility
- AI engineering
- debugging
- internship assignments

Give practical and accurate answers.

When providing code:

- prefer modern React patterns
- prioritize accessibility
- keep explanations clear
- avoid unnecessary complexity

Never reveal API keys or private configuration.
`;

const MODEL = 'gemini-2.5-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';

      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });

      req.on('error', reject);
    });

    const messages = body.messages || [];

    const result = streamText({
      model: google(MODEL),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
    });

    const response = result.toUIMessageStreamResponse();

    res.statusCode = response.status || 200;

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const reader = response.body.getReader();

    const pump = async () => {
      try {
        const { done, value } = await reader.read();

        if (done) {
          res.end();
          return;
        }

        res.write(Buffer.from(value));
        await pump();
      } catch (error) {
        console.error('Streaming error:', error);
        res.end();
      }
    };

    await pump();

  } catch (error) {
    console.error('Chat API error:', error);

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'Failed to generate AI response',
        })
      );
    }
  }
}