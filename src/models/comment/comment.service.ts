import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { Article } from '../article/entities/article.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(createCommentDto: CreateCommentDto, slug: string, user: User) {
    const { body } = createCommentDto.comment;

    const article = await this.articleRepository.findOne({ where: { slug } });

    if (!article) {
      throw new NotFoundException(`Article ${slug} not found`);
    }

    const comment = this.commentRepository.create({
      body,
      author: user,
      article,
    });

    return await this.commentRepository.save(comment);
  }

  async findAll(slug: string) {
    const comments = await this.commentRepository.find({
      where: {
        article: {
          slug: slug,
        },
      },
      relations: ['author', 'author.profile'],
    });

    return comments;
  }

  async remove(slug: string, commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ["article"]
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if(comment.article.slug !== slug) {
      throw new NotFoundException('Comment does not belong to the specified article')
    }

    return this.commentRepository.remove(comment);
  }
}
