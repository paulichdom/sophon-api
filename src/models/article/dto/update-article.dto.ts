import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleData, CreateArticleDto } from './create-article.dto';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArticleData extends PartialType(CreateArticleData) {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  body: string;
}

export class UpdateArticleDto {
  @ValidateNested()
  @Type(() => UpdateArticleData)
  article: UpdateArticleData;
}
