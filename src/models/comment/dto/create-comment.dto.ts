import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentBodyDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class CreateCommentDto {
  @ValidateNested()
  @Type(() => CommentBodyDto)
  comment: CommentBodyDto;
}
