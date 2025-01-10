import { Expose, Transform } from "class-transformer";

export class ArticleDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  body: string;

  @Expose()
  tagList: string[];

  @Transform(({obj}) => obj.author.id)
  @Expose()
  authorId: number;
}