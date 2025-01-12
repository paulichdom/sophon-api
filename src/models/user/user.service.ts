import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { ProfileEntity } from '../profile/entities/profile.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { Role } from '../../common/constants/role.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>
  ) { }

  async create(username: string, email: string, password: string) {
    const user = this.userRepository.create({ email, password });
    user.profile = this.profileRepository.create({ username: username, user: user })

    const defaultRoles = [Role.EDITOR, Role.GHOST];
    const roles = await this.roleRepository.findBy({
      name: In(defaultRoles)
    });
    user.roles = roles;

    return await this.userRepository.save(user);;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'roles']
    });
  }

  find(email: string) {
    return this.userRepository.find({ 
      where: { email },
      relations: ['profile', 'roles']
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async reomove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.remove(user);
  }
}
