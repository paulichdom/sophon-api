import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthService } from '../../auth/auth.service';
import { UserController } from './user.controller';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { RoleModule } from '../role/role.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileService } from '../profile/profile.service';
import { ProfileEntity } from '../profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProfileEntity]),
    RoleModule,
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, ProfileService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
