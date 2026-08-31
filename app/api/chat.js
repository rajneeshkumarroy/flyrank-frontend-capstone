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
  // --------------------------------------------------
  // 1. Only POST requests are allowed
  // --------------------------------------------------

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
    // --------------------------------------------------
    // 2. Read request body
    // --------------------------------------------------

    let body = req.body;

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    body = body || {};

    const messages = body.messages;
    const testMode = body.testMode;

    // --------------------------------------------------
    // 3. Validate messages
    // --------------------------------------------------

    if (!Array.isArray(messages) || messages.length === 0) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');

      res.end(
        JSON.stringify({
          error: 'Please provide at least one message.',
        })
      );

      return;
    }

    // --------------------------------------------------
    // 4. FE-08 SABOTAGE MODES
    // --------------------------------------------------

    // Simulate normal server/API failure
    if (testMode === 'error') {
      throw new Error('FE-08 simulated server failure');
    }

    // Simulate rate limiting
    if (testMode === 'rate-limit') {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Retry-After', '5');

      res.end(
        JSON.stringify({
          error: 'Too many requests. Please try again shortly.',
        })
      );

      return;
    }

    // --------------------------------------------------
    // 5. Convert messages for AI SDK
    // --------------------------------------------------

    const modelMessages =
      await convertToModelMessages(messages);

    // --------------------------------------------------
    // 6. Create Gemini streaming response
    // --------------------------------------------------

    const result = streamText({
      model: google(MODEL),

      system: SYSTEM_PROMPT,

      messages: modelMessages,

      tools: {
        analyzeFrontendQuestion,
      },

      stopWhen: stepCountIs(3),
    });

    // --------------------------------------------------
    // 7. Convert to UI message stream
    // --------------------------------------------------

    const response = result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error('AI stream error:', error);

        return 'The AI response was interrupted. Please try again.';
      },
    });

    // --------------------------------------------------
    // 8. Forward response headers
    // --------------------------------------------------

    res.statusCode = response.status || 200;

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // --------------------------------------------------
    // 9. Read AI stream
    // --------------------------------------------------

    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error('AI response stream is unavailable.');
    }

    let chunkCount = 0;

    // --------------------------------------------------
    // 10. Forward streamed chunks
    // --------------------------------------------------

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunkCount++;

      res.write(Buffer.from(value));

      // ------------------------------------------------
      // FE-08 MID-STREAM FAILURE
      // ------------------------------------------------
      // Allow several chunks to reach the browser first.
      // Then intentionally destroy the connection.
      // ------------------------------------------------

      if (testMode === 'mid-stream' && chunkCount >= 5) {
        console.error(
          'FE-08: Simulating mid-stream failure.'
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 300)
        );

        res.destroy();

        return;
      }
    }

    // --------------------------------------------------
    // 11. Finish response
    // --------------------------------------------------

    if (!res.writableEnded) {
      res.end();
    }
  } catch (error) {
    // --------------------------------------------------
    // 12. Global API error handling
    // --------------------------------------------------

    console.error('Chat API error:', error);

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');

      res.end(
        JSON.stringify({
          error: 'Failed to generate AI response.',
        })
      );
    } else if (!res.writableEnded) {
      res.end();
    }
  }
}