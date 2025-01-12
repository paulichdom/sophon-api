import { Expose, Transform, Type } from 'class-transformer';
import { ArticleDto } from './article.dto';

export class SingleArticleDto {
  @Expose()
  @Transform(({ obj }) => obj.article)
  article: ArticleDto;
}
