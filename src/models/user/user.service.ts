import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { ProfileEntity } from '../profile/entities/profile.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { Role } from '../../common/constants/role.constant';
import { UserCreatedEvent } from './events/user.event';

@Injectable()
export class UserService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async create(username: string, email: string, password: string) {
    const user = this.userRepository.create({ email, username, password });

    const defaultRoles = [Role.EDITOR, Role.GHOST];
    const roles = await this.roleRepository.findBy({
      name: In(defaultRoles),
    });
    user.roles = roles;

    const savedUser = await this.userRepository.save(user);

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent({
        userId: user.id,
        payload: user,
      }),
    );

    return savedUser;
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

  find(email: string) {
    return this.userRepository.find({
      where: { email },
      relations: ['profile', 'roles'],
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findBy({username})
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
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
