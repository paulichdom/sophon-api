import { Expose, Transform } from 'class-transformer';
import { RoleEntity } from '../../role/entities/role.entity';

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

  @Transform(({ obj }) => obj.roles?.map((role: RoleEntity) => role.name) || [])
  @Expose()
  roles: string[];
}
