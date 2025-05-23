import { Expose, Transform, Type } from 'class-transformer';

export class AuthUserData {
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

export class AuthUserDto {
  @Expose()
  @Type(() => AuthUserData)
  user: AuthUserData
}
