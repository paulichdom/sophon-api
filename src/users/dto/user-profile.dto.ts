import { Expose } from 'class-transformer';

export class UserProfileDto {
  @Expose()
  username: string;

  @Expose()
  bio: string;

  @Expose()
  image: string;

  @Expose()
  following: boolean;
}
