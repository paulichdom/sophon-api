import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

export class CreateUserData {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Username is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(24, {
    message: 'Username is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(24, {
    message: 'Password is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  password: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserData)
  user: CreateUserData
}
