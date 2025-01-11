import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {APP_PIPE} from '@nestjs/core'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { UsersModule } from './models/user/users.module';
import { ArticlesModule } from './models/article/articles.module';
import { ReportsModule } from './models/report/reports.module';
import { TypeOrmConfigService } from './config/typeorm.config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    UsersModule,
    ArticlesModule,
    ReportsModule,
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
      }),
    }
  ],
})

export class AppModule {
  constructor(
    private configService: ConfigService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    // Session middleware configured through NestJS middleware system
    // Located in AppModule for proper DI integration and middleware lifecycle management
    consumer.apply(
      cookieSession({
        keys: [this.configService.get('COOKIE_KEY')],
      }),
    )
    .forRoutes('*')
  }
}
