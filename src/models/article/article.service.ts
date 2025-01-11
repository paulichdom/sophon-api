import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { User } from '../user/entities/user.entity';


@Injectable()
export class ArticleService {
  constructor(@InjectRepository(Article) private repo: Repository<Article>) {}

  async create(createArticleDto: CreateArticleDto, user: User) {
    const article = this.repo.create({
      ...createArticleDto,
      author: user,
      slug: this.slugify(createArticleDto.title)
    });

    return this.repo.save(article);
  }

  findAll() {
    return `This action returns all articles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }

  slugify (input: string) {
    return input
      .toLowerCase()
      .normalize('NFD') 
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]+/g, '')
      .slice(0, 50);
  };
}
