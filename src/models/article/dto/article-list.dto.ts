import { Expose, Transform, Type } from 'class-transformer';
import { ArticleDto } from './article.dto';

export class ArticleListDto {
  @Expose()
  @Transform(({ obj }) => obj.articles)
  articles: ArticleDto[];

  @Expose()
  articlesCount: number;
}
