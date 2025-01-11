import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../profile/entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>
  ) {}

  async create(username: string, email: string, password: string) {
    const user = this.userRepository.create({ email, password });
    const savedUser = await this.userRepository.save(user);

    const profile = this.profileRepository.create({username: username, user: user})
    await this.profileRepository.save(profile)

    return savedUser;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepository.findOneBy({ id });
  }

  find(email: string) {
    return this.userRepository.find({ where: { email } });
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
