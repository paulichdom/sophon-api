import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { ArticleModule } from '../article/article.module';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { User } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { Article } from '../article/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, User, Article]),
    UserModule,
    ArticleModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
