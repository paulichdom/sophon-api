import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ProfileDto } from 'src/models/profile/dto/profile.dto';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  token: string;

  @Transform(({ obj }) => obj.profile.username)
  @Expose()
  username: string;

  @Transform(({ obj }) => obj.profile.bio)
  @Expose()
  bio: string;

  @Transform(({ obj }) => obj.profile.image)
  @Expose()
  image: string;
}
