import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticlesController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User]), UserModule],
  controllers: [ArticlesController],
  providers: [ArticleService],
})
export class ArticleModule {}
