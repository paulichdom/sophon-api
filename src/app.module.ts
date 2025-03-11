import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './models/user/user.module';
import { ArticleModule } from './models/article/article.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { ProfileModule } from './models/profile/profile.module';
import { RoleModule } from './models/role/role.module';
import { CommentModule } from './models/comment/comment.module';
import { TagModule } from './models/tag/tag.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    ArticleModule,
    ProfileModule,
    RoleModule,
    CommentModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Global validation pipe configured via DI system for better testability
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        enableDebugMessages: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})

export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Session middleware configured through NestJS middleware system
    // Located in AppModule for proper DI integration and middleware lifecycle management
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
