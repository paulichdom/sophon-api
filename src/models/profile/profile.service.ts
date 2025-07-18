import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityManager } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  async findOne(username: string, user?: User) {
    const follower = user
      ? await this.userRepository.findOne({ where: { id: user.id } })
      : null;

    const following = await this.userRepository.findOne({
      where: { username },
      relations: ['profile', 'followers', 'followers.profile'],
    });

    const { username: profileUsername, bio, image } = following.profile;

    const followers = following.followers.map(({ profile }) => ({
      username: profile.username,
      bio: profile.bio,
      image: profile.image,
    }));

    return {
      username: profileUsername,
      bio,
      image,
      following: follower ? this.isFollowing(follower, following) : false,
      followers,
    };
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
      relations: ['profile', 'followers'],
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

    const isFollowing = this.isFollowing(follower, following);

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

    const { username, bio, image } = following.profile;

    return {
      username,
      bio,
      image,
      following: this.isFollowing(follower, following),
    };
  }

  async unfollow(folowingUsername: string, user: User) {
    if (!folowingUsername) {
      throw new HttpException('Username not provided', HttpStatus.BAD_REQUEST);
    }

    const follower = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['following'],
    });

    const following = await this.userRepository.findOne({
      where: { username: folowingUsername },
      relations: ['profile', 'followers'],
    });

    if (!follower || !following) {
      throw new Error('User not found');
    }

    const isFollowing = this.isFollowing(follower, following);

    if (isFollowing) {
      await this.entityManager.transaction(
        async (trasactionalEntityManager: EntityManager) => {
          await this.removeFollowing(
            trasactionalEntityManager,
            follower,
            following,
          );
          await this.removeFollower(
            trasactionalEntityManager,
            following,
            follower,
          );
        },
      );
    }

    const { username, bio, image } = following.profile;

    return {
      username,
      bio,
      image,
      following: this.isFollowing(follower, following),
    };
  }

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
    user.following = user.following.filter(
      (followingItem) => followingItem.id !== following.id,
    );
    await entityManager.save(user);
  }

  private async removeFollower(
    entityManager: EntityManager,
    following: User,
    user: User,
  ) {
    following.followers = following.followers.filter(
      (followerItem) => followerItem.id !== user.id,
    );
    await entityManager.save(following);
  }

  private isFollowing(follower: User, following: User): boolean {
    return following.followers.some(
      (followerEntity) => followerEntity.id === follower.id,
    );
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const { profile: updateProfileData } = updateProfileDto;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user || !user.profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const profile = user.profile;

    if (updateProfileData.username !== undefined) {
      const existingUserame = await this.profileRepository.findOne({
        where: { username: updateProfileData.username },
      });

      if (existingUserame && existingUserame.id !== profile.id) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      profile.username = updateProfileData.username;
      user.username = updateProfileData.username;
    }
    if (updateProfileData.bio !== undefined)
      profile.bio = updateProfileData.bio;
    if (updateProfileData.image !== undefined)
      profile.image = updateProfileData.image;

    await this.profileRepository.save(profile);
    await this.userRepository.save(user);

    return {
      username: profile.username,
      bio: profile.bio,
      image: profile.image,
    };
  }
}
