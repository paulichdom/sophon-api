import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, In, Repository } from 'typeorm';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createArticleDto: CreateArticleDto, user: User) {
    const article = this.articleRepository.create({
      ...createArticleDto,
      author: user,
      slug: this.slugify(createArticleDto.title),
    });

    const savedArticle = await this.articleRepository.save(article);

    return {
      ...savedArticle,
      author: savedArticle.author.profile,
    };
  }

  async findAll(query?: Record<string, string>) {
    const authorFilter =
      'author' in query
        ? { author: { profile: { username: query.author } } }
        : undefined;

    const tagFilter =
      'tag' in query ? { tagList: ArrayContains([query.tag]) } : undefined;

    const whereConditions = [authorFilter, tagFilter].filter(Boolean);

    const [articles, count] = await this.articleRepository.findAndCount({
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
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'author.profile'],
    });

    return {
      ...article,
      author: article.author.profile,
    };
  }

  async update(slug: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOneBy({ slug });

    if (!article) {
      throw new NotFoundException(`Article ${slug} not found`);
    }

    const updateArticlePayload = {
      ...updateArticleDto,
      slug: updateArticleDto.title
        ? this.slugify(updateArticleDto.title)
        : article.slug,
    };

    const updatedArticle = this.articleRepository.merge(
      article,
      updateArticlePayload,
    );

    return this.articleRepository.save(updatedArticle);
  }

  async favorite(slug: string, user: User) {
    let article = await this.articleRepository.findOne({
      where: { slug },
    });

    console.log({ user });

    const isNewFavorite =
      user.favoritedArticles &&
      user.favoritedArticles.findIndex(
        (_article) => _article.id === article.id,
      ) < 0;

    if (isNewFavorite) {
      if (!article.favoritedBy) {
        article.favoritedBy = [];
      }

      article.favoritedBy.push(user);
      article.favoriteCount++;

      article = await this.articleRepository.save(article);
    }

    return { article };
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
