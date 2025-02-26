import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProfileDto } from './dto/profile.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @Serialize(ProfileDto)
  async findOne(
    @Param('username') username: string,
    @CurrentUser() user: User,
  ) {
    const profile = await this.profileService.findOne(username, user);
    return { profile: profile };
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  @Serialize(ProfileDto)
  async follow(@Param('username') username: string, @CurrentUser() user: User) {
    const followingProfile = await this.profileService.follow(username, user);
    return { profile: followingProfile };
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  @Serialize(ProfileDto)
  async unfollow(
    @Param('username') username: string,
    @CurrentUser() user: User,
  ) {
    const unfollowProfile = await this.profileService.unfollow(username, user);
    return { profile: unfollowProfile };
  }
}
