import { Expose, Transform, Type } from 'class-transformer';
import { ProfileDto } from '../../profile/dto/profile.dto';

export class ArticleData {
  @Expose() id: number;
  @Expose() slug: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() body: string;

  @Transform(({ obj }) => obj.tags.map((tag) => tag.name))
  @Expose()
  tagList: string[];

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
  @Expose() favorited: boolean;
  @Expose() favoritesCount: number;

  @Transform(({ obj }) => obj.author.profile)
  @Expose()
  author: ProfileDto;
}

export class ArticleDto {
  @Expose()
  @Type(() => ArticleData)
  article: ArticleData;
}

export class ArticleListDto {
  @Expose()
  @Type(() => ArticleData)
  articles: ArticleData[];

  @Expose()
  articlesCount: number;
}
