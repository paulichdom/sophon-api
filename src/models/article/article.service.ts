import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, In, Repository } from 'typeorm';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(Article) private repo: Repository<Article>) { }

  async create(createArticleDto: CreateArticleDto, user: User) {
    const article = this.repo.create({
      ...createArticleDto,
      author: user,
      slug: this.slugify(createArticleDto.title),
    });

    const savedArticle = await this.repo.save(article);

    return {
      ...savedArticle,
      author: savedArticle.author.profile,
    }
  }

  async findAll(query?: Record<string, string>) {
    const authorFilter = 'author' in query
      ? { author: { profile: { username: query.author } } }
      : undefined;

    const tagFilter = 'tag' in query
      ? { tagList: ArrayContains([query.tag]) }
      : undefined;

    const whereConditions = [authorFilter, tagFilter].filter(Boolean);

    const [articles, count] = await this.repo.findAndCount({
      relations: ['author', 'author.profile'],
      where: whereConditions,
    });

    const mappedArticles = articles.map((article) => {
      return {
        ...article,
        author: article.author.profile,
      };
    });

    return {
      articles: [...mappedArticles],
      articlesCount: count,
    };
  }

  async findOne(slug: string) {
    const article = await this.repo.findOne({
      where: { slug },
      relations: ['author', 'author.profile'],
    });

    return {
      ...article,
      author: article.author.profile,
    };
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
