import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  token: string;

  @Expose()
  username: string;

  @Expose()
  bio: string;

  @Expose()
  image: string;
}
