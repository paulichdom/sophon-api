import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateUserData {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateUserData)
  user: UpdateUserData
}
