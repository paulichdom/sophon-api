import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import {APP_PIPE} from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ArticlesModule } from './articles/articles.module';
import { Article } from './articles/article.entity';
import { ReportsModule } from './reports/reports.module';
import { Report } from './reports/entities/report.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Article, Report]
        }
      }
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
  configure(consumer: MiddlewareConsumer) {
    // Session middleware configured through NestJS middleware system
    // Located in AppModule for proper DI integration and middleware lifecycle management
    consumer.apply(
      cookieSession({
        keys: [process.env.COOKIE_KEY || 'development-key-only'],
      }),
    )
    .forRoutes('*')
  }
}
