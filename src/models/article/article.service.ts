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
      favorited: false,
    };
  }

  async findAll(user: User, query?: Record<string, string>, ) {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    queryBuilder
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile');
    
    if('author' in query) {
      queryBuilder.andWhere('profile.username = :username', {username: query.author})
    }

    if('tag' in query) {
      queryBuilder.andWhere(':tag = ANY(article.tagList)', {tag: query.tag})
    }

    queryBuilder.leftJoinAndSelect(
      'article.favoritedBy',
      'favoriteCheck',
      'favoriteCheck.id = :userId',
      {userId: user.id}
    )

    const [articles, count] = await queryBuilder.getManyAndCount();

    const results = articles.map((article) => {
      const isFavorited = Array.isArray(article.favoritedBy) && article.favoritedBy.length > 0;

      return {
        ...article,
        favorited: isFavorited
      }
    })

    return {
      articles: results,
      articlesCount: count
    }
  }

  async findOne(slug: string, user: User) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'author.profile'],
    });

    if (!article) {
      throw new NotFoundException(`Article ${slug} not found`);
    }

    const isFavorited = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.favoritedBy', 'user')
      .where('article.id = :articleId', { articleId: article.id })
      .andWhere('user.id = :userId', { userId: user.id })
      .getCount();

    return {
      ...article,
      favorited: isFavorited > 0,
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
      relations: ['favoritedBy', 'author', 'author.profile'],
    });

    const userWithFavorited = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favoritedArticles'],
    });

    const isNewFavorite =
      userWithFavorited.favoritedArticles.findIndex(
        (_article) => _article.id === article.id,
      ) < 0;

    if (isNewFavorite) {
      if (!article.favoritedBy) {
        article.favoritedBy = [];
      }

      article.favoritedBy.push(userWithFavorited);
      article.favoritesCount++;

      article = await this.articleRepository.save(article);
    }

    return {
      ...article,
      favorited: true,
    };
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
