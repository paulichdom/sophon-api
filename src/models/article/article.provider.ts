import { Injectable } from '@nestjs/common';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { generateArticleSchema } from './schemas/generate-article.schema';
import { system } from 'src/ai-sdk/prompts/generate-article.prompt';
import { Models } from 'src/ai-sdk/models';

@Injectable()
export class ArticleProvider {
  async generateArticleObject(prompt: string) {
    const { object } = await generateObject({
      model: google(Models.GEMINI_2_0_FLASH_EXP, {}),
      schema: generateArticleSchema,
      schemaName: 'Article',
      schemaDescription:
        'A wrapper object with an "article" key containing structured content.',
      system,
      prompt,
    });

    return object;
  }
}
