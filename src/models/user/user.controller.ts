import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { UserService } from './user.service';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisteredUserDto } from './dto/registered-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private usersService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  @Serialize(AuthUserDto)
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password, username } = body.user;
    const registeredUser = await this.authService.register(
      username,
      email,
      password,
    );
    
    session.userId = registeredUser.id;
    return { user: registeredUser };
  }

  @Post('/login')
  @Serialize(AuthUserDto)
  async login(@Body() body: LoginUserDto, @Session() session: any) {
    const { email, password } = body.user;
    const authUser = await this.authService.login(email, password);
    session.userId = authUser.user.id;
    
    return authUser;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  @Serialize(AuthUserDto)
  whoAmI(@CurrentUser() user: User) {
    return { user };
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @Serialize(AuthUserDto)
  async findUser(@Param('id') id: string) {
    const foundUserId = await this.usersService.findOne(parseInt(id));
    if (!foundUserId) {
      throw new NotFoundException('User not found');
    }
    return { user: foundUserId };
  }

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(AuthUserDto)
  async findByEmail(@Query('email') email: string) {
    const foundUserEmail = await this.usersService.find(email);
    return { user: foundUserEmail };
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Serialize(AuthUserDto)
  async removeUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.remove(parseInt(id));
    return { user: deletedUser };
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @Serialize(AuthUserDto)
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const updatedUser = await this.usersService.update(parseInt(id), body.user);
    return { user: updatedUser };
  }
}
