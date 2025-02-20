import { Expose, Type } from 'class-transformer';

export class RegisteredUserData {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  token: string;
}

export class RegisteredUserDto {
  @Expose()
  @Type(() => RegisteredUserData)
  user: RegisteredUserData
}
