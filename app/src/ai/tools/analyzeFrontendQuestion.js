import { tool } from 'ai';
import { z } from 'zod';

export const analyzeFrontendQuestion = tool({
  description:
    'Analyze a frontend development question and return structured learning guidance.',

  inputSchema: z.object({
    topic: z
      .string()
      .describe('The main frontend topic being discussed'),

    difficulty: z
      .enum(['Beginner', 'Intermediate', 'Advanced'])
      .describe('Estimated difficulty level of the topic'),

    category: z
      .string()
      .describe('Frontend category such as React, JavaScript, CSS, accessibility, or AI'),

    keyConcepts: z
      .array(z.string())
      .describe('Important concepts the learner should understand'),
  }),

  execute: async ({
    topic,
    difficulty,
    category,
    keyConcepts,
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      topic,
      difficulty,
      category,
      keyConcepts,
      recommendation:
        difficulty === 'Beginner'
          ? 'Start with a small practical example and understand the core concept first.'
          : difficulty === 'Intermediate'
            ? 'Practice the concept with a real frontend feature and review common edge cases.'
            : 'Work on a production-style implementation and focus on performance, accessibility, and maintainability.',
      analyzedAt: new Date().toISOString(),
    };
  },
});