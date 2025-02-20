import { Type } from 'class-transformer';
import { IsEmail, IsString, IsNotEmpty, ValidateNested } from 'class-validator';

export class LoginUserData {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoginUserData)
  user: LoginUserData
}
