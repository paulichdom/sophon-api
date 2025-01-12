import { Expose, Type } from "class-transformer";
import { ProfileDto } from "../../profile/dto/profile.dto";

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
  favoritesCount: 0;

  @Expose()
  @Type(() => ProfileDto)
  author: ProfileDto
}