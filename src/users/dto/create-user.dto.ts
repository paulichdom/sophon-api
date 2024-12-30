import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  token?: string;

  @IsString()
  bio?: string;

  @IsString()
  image?: string;
}
