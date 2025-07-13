import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { Role } from '../../common/constants/role.constant';
import { ProfileEntity } from '../profile/entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  async create(username: string, email: string, password: string) {
    const user = this.userRepository.create({ email, username, password });

    const defaultRoles = [Role.EDITOR, Role.GHOST];
    const roles = await this.roleRepository.findBy({
      name: In(defaultRoles),
    });
    user.roles = roles;

    const savedUser = await this.userRepository.save(user);

    const userProfile = this.profileRepository.create({
      username: savedUser.username,
      user: savedUser,
    });

    await this.profileRepository.save(userProfile);

    const userWithProfile = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['profile', 'roles'],
    });

    return userWithProfile;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'roles'],
    });
  }

  async find(email: string) {
    const user = await this.userRepository.find({
      where: { email },
      relations: ['profile', 'roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = this.userRepository.findBy({ username });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['profile', 'roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.remove(user);
  }
}
