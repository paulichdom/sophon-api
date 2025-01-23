import { Expose, Type } from 'class-transformer';
import { ArticleDto } from './article.dto';

export class SingleArticleDto {
  @Expose()
  @Type(() => ArticleDto)
  article: ArticleDto;
}
