import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthService } from '../../auth/auth.service';
import { UserController } from './user.controller';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { ProfileModule } from '../profile/profile.module';
import { RoleModule } from '../role/role.module';
import { ProfileService } from '../profile/profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
    ProfileModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    ProfileService
  ],
})

export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
