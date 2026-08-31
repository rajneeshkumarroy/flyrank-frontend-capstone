import {
  streamText,
  convertToModelMessages,
  stepCountIs,
} from 'ai';

import { google } from '@ai-sdk/google';

import { analyzeFrontendQuestion } from '../src/ai/tools/analyzeFrontendQuestion.js';

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

When the user asks you to analyze, classify, or provide
structured learning guidance about a frontend topic, use
the analyzeFrontendQuestion tool.

The tool should be used when structured analysis would
genuinely improve the answer, not for every simple question.

When providing code:

- prefer modern React patterns
- prioritize accessibility
- keep explanations clear
- avoid unnecessary complexity

After the tool returns its result, explain the result naturally
to the user.

Never reveal API keys or private configuration.
`;

const MODEL = 'gemini-2.5-flash';

export default async function handler(req, res) {
  // Only POST requests are allowed.
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');

    res.end(
      JSON.stringify({
        error: 'Method not allowed',
      })
    );

    return;
  }

  try {
    // Read the incoming JSON request body.
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

    // Stream the Gemini response and allow tool execution.
    const result = streamText({
      model: google(MODEL),

      system: SYSTEM_PROMPT,

      messages: await convertToModelMessages(messages),

      tools: {
        analyzeFrontendQuestion,
      },

      // Allows the model to call the tool and then continue
      // with a final response.
      stopWhen: stepCountIs(3),
    });

    // Convert the result into the UI message stream format
    // expected by useChat().
    const response = result.toUIMessageStreamResponse();

    res.statusCode = response.status || 200;

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const reader = response.body.getReader();

    // Forward the streamed response to the browser.
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

        if (!res.writableEnded) {
          res.end();
        }
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