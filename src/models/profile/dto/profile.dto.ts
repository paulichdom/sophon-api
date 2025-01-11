import { Expose } from 'class-transformer';

export class ProfileDto {
  @Expose()
  username: string;

  @Expose()
  bio: string;

  @Expose()
  image: string;
}
