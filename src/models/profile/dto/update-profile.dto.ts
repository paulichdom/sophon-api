import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateProfileData {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  image: string;
}

export class UpdateProfileDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateProfileData)
  profile: UpdateProfileData;
}
