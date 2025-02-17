import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthService } from '../../auth/auth.service';
import { UserController } from './user.controller';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
