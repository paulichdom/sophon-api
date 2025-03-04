import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateArticleData {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, {
    each: true,
    message: 'Tag must be at least 3 characters long.',
  })
  @MaxLength(20, {
    each: true,
    message: 'Tag must not exceed 20 characters in length.',
  })
  tagList: string[];
}

export class CreateArticleDto {
  @ValidateNested()
  @Type(() => CreateArticleData)
  article: CreateArticleData;
}
