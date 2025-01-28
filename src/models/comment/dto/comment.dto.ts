import { Expose, Transform, Type } from 'class-transformer';
import { ProfileDto } from 'src/models/profile/dto/profile.dto';

export class CommentDataDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  body: string;

  @Expose()
  @Transform(({ obj }) => obj.author.profile)
  author: ProfileDto;
}

export class CommentDto {
  @Expose()
  @Type(() => CommentDataDto)
  comment: CommentDataDto;
}
