import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { Role } from '../../common/constants/role.constant';
import { UserCreatedEvent } from './events/user.event';

@Injectable()
export class UserService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    const user = this.userRepository.find({
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
