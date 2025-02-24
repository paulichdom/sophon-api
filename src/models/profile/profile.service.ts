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
    if (!folowingUsername) {
      throw new HttpException('Username not provided', HttpStatus.BAD_REQUEST);
    }

    const follower = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['following'],
    });

    const following = await this.userRepository.findOne({
      where: { username: folowingUsername },
      relations: ['profile','followers'],
    });

    if (!follower || !following) {
      throw new Error('User not found');
    }

    if (following.email === follower.email) {
      throw new HttpException(
        'This user cannot be added to your following list.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasFollowers = following.followers.length > 0;
    const isFollowing =
      hasFollowers &&
      following.followers.some(
        (followerEntity) => followerEntity.id === follower.id,
      );

    if (!isFollowing) {
      await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          await this.addFollowing(
            transactionalEntityManager,
            follower,
            following,
          );
          await this.addFollower(
            transactionalEntityManager,
            following,
            follower,
          );
        },
      );
    }

    const {username, bio, image} = following.profile

    return {
      username,
      bio,
      image,
      following: true
    }
  }

  async unfollow(username: string) {}

  private async addFollowing(
    entityManager: EntityManager,
    user: User,
    following: User,
  ) {
    user.following.push(following);
    await entityManager.save(user);
  }

  private async addFollower(
    entityManager: EntityManager,
    following: User,
    user: User,
  ) {
    following.followers.push(user);
    await entityManager.save(following);
  }

  private async removeFollowing(
    entityManager: EntityManager,
    user: User,
    following: User,
  ) {
    user.following = user.following.filter((f) => f.id !== following.id);
    await entityManager.save(user);
  }

  private async removeFollower(
    entityManager: EntityManager,
    following: User,
    user: User,
  ) {
    following.followers = following.followers.filter((f) => f.id !== user.id);
    await entityManager.save(following);
  }
}
