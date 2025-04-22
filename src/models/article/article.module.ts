import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticlesController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { TagModule } from '../tag/tag.module';
import { Tag } from '../tag/entities/tag.entity';
import { ArticleProvider } from './article.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User, Tag]),
    UserModule,
    TagModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticleService, ArticleProvider],
})
export class ArticleModule {}
