import { Expose, Type } from 'class-transformer';

export class ProfileDataDto {
  @Expose()
  username: string;

  @Expose()
  bio: string;

  @Expose()
  image: string;

  @Expose()
  following: boolean;

  @Expose()
  followers: Partial<ProfileDataDto>[];
}

export class ProfileDto {
  @Expose()
  @Type(() => ProfileDataDto)
  profile: ProfileDataDto;
}
