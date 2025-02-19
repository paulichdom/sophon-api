import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfileEntity } from './entities/profile.entity';
import { User } from '../user/entities/user.entity';
import { UserCreatedEvent } from '../user/events/user.event';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(payload: UserCreatedEvent) {
    const { payload: user } = payload;
    const userProfile = await this.profileRepository.create({
      username: user.username,
      user: user,
    });

    void this.profileRepository.save(userProfile);
  }

  async findOne(username: string) {
    return await this.profileRepository.findOne({
      where: { username },
    });
  }

  async follow(username: string) {}

  async unfollow(username: string) {}
}
