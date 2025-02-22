import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityManager } from 'typeorm';

import { ProfileEntity } from './entities/profile.entity';
import { User } from '../user/entities/user.entity';
import { UserCreatedEvent } from '../user/events/user.event';

@Injectable()
export class ProfileService {
  constructor(
    private readonly entityManager: EntityManager,
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

  async follow(folowingUsername: string, user: User) {
    // TODO: get current user relations: following and followers
    // depending on the helper functions, see chat
    if (!folowingUsername) {
      throw new HttpException('Username not provided', HttpStatus.BAD_REQUEST);
    }

    const following = await this.userRepository.findOne({
      where: { username: folowingUsername },
      relations: ['followers'],
    });

    if (!following) {
      throw new Error('Following user not found');
    }
    console.log({folowingUsername, following, user})

    if (following.email === user.email) {
      throw new HttpException(
        'This user cannot be added to your following list.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasFollowers = following.followers.length > 0;
    const isFollowing = hasFollowers && following.followers.some(follower => follower.id === user.id);

    if(!isFollowing) {
      const followResult = await this.entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
        await this.addFollowing(transactionalEntityManager, user, following);
        await this.addFollower(transactionalEntityManager, following, user);
      })

      console.log({followResult})
    }
  }

  async unfollow(username: string) {}

  private async addFollowing(entityManager: EntityManager, user: User, following: User) {
    user.following.push(following);
    await entityManager.save(user);
  }
  
  private async addFollower(entityManager: EntityManager, following: User, user: User) {
    following.followers.push(user);
    await entityManager.save(following);
  }

  private async removeFollowing(entityManager: EntityManager, user: User, following: User) {
    user.following = user.following.filter(f => f.id !== following.id);
    await entityManager.save(user);
  }
  
  private async removeFollower(entityManager: EntityManager, following: User, user: User) {
    following.followers = following.followers.filter(f => f.id !== user.id);
    await entityManager.save(following);
  }
}
