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
      slug: this.slugify(createArticleDto.title),
    });

    const savedArticle = await this.repo.save(article);

    return {
      article: {
        ...savedArticle,
        author: savedArticle.author.profile,
      },
    };
  }

  async findAll() {
    const allArticles = await this.repo.find({
      relations: ['author', 'author.profile'],
    });

    const mappedArticles = allArticles.map((article) => {
      return {
        ...article,
        author: article.author.profile,
      };
    });

    return {
      articles: [...mappedArticles],
      articlesCount: mappedArticles.length,
    };
  }

  async findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['author', 'author.profile'],
    });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }

  slugify(input: string) {
    return input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]+/g, '')
      .slice(0, 50);
  }
}
