import { Expose, Transform, Type } from 'class-transformer';
import { ProfileDto } from '../../profile/dto/profile.dto';

export class ArticleDto {
  @Expose()
  id: number;

  @Expose()
  slug: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  body: string;

  @Expose()
  tagList: string[];

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  favorited: boolean;

  @Expose()
  favoritesCount: number;

  @Transform(({ obj }) => obj.author.profile)
  @Expose()
  author: ProfileDto;
}
