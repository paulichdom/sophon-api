import {
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProfileDto } from './dto/profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @Serialize(ProfileDto)
  findOne(@Param('username') username: string) {
    const profile = this.profileService.findOne(username);
    return { profile: profile };
  }

  @Post(':username/follow')
  async follow(@Param('username') username: string) {
    return await this.profileService.follow(username)
  }
}
