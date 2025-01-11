import { Expose, Transform, Type } from "class-transformer";
import { UserProfileDto } from "../../users/dto/user-profile.dto";

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

  @Expose()
  @Type(() => UserProfileDto)
  author: UserProfileDto

  @Transform(({obj}) => obj.author.id)
  @Expose()
  authorId: number;
}