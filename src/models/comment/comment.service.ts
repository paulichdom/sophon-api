import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { Article } from '../article/entities/article.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

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
      throw new Error('Article not found');
    }

    const comment = this.commentRepository.create({
      body,
      author: user,
      article,
    });

    return await this.commentRepository.save(comment);
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
