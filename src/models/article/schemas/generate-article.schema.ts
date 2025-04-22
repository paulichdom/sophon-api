import { z } from 'zod';

export const generateArticleSchema = z.object({
  article: z.object({
    title: z
      .string()
      .describe('The headline of the article, concise and engaging.'),
    description: z
      .string()
      .describe('A brief summary or excerpt of the article.'),
    body: z
      .string()
      .describe(
        'The full markdown or HTML content of the article with structured paragraphs and sections.',
      ),
    tagList: z
      .array(z.string())
      .describe('An array of relevant keywords categorizing the article.'),
  }),
});
