import { Module, ValidationPipe } from '@nestjs/common';
import {APP_PIPE} from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ArticlesModule } from './articles/articles.module';
import { Article } from './articles/article.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Article],
      synchronize: true,
    }),
    UsersModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        skipMissingProperties: true,
        enableDebugMessages: true,
      }),
    }
  ],
})
export class AppModule {}
