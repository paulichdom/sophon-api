import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../user/events/user.event';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  async findOne(username: string) {
    return await this.profileRepository.findOne({
      where: { username },
    }); 
  }

  @OnEvent('user.created')
  async handleUserCreatedEvent(payload: UserCreatedEvent) {
    const {payload: user} = payload;
    const userProfile = await this.profileRepository.create({
      username: user.username,
      user: user
    })

    void this.profileRepository.save(userProfile);
  }
}
