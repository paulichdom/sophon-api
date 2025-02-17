import { Expose, Transform } from 'class-transformer';
import { RoleEntity } from '../../role/entities/role.entity';

export class RegisterUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  token: string;

  @Transform(({ obj }) => obj.roles?.map((role: RoleEntity) => role.name) || [])
  @Expose()
  roles: string[];
}
