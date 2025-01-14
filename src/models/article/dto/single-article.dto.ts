import { Expose, Transform } from 'class-transformer';
import { ArticleDto } from './article.dto';

export class SingleArticleDto {
  @Expose()
  @Transform(({ obj }) => obj)
  article: ArticleDto;
}
