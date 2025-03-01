import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    // TODO: create new tags and associate them with the article entity

    const savedArticle = await this.articleRepository.save(article);

    return {
      ...savedArticle,
      favorited: false,
    };
  }

  async findAll(user: User, query?: Record<string, string>) {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    queryBuilder
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile');

    if ('author' in query) {
      queryBuilder.andWhere('profile.username = :username', {
        username: query.author,
      });
    }

    if ('tag' in query) {
      queryBuilder.andWhere(':tag = ANY(article.tagList)', { tag: query.tag });
    }

    if ('favorited' in query) {
      queryBuilder
        .innerJoin('article.favoritedBy', 'favoritedUser')
        .innerJoin('favoritedUser.profile', 'favoritedUserProfile')
        .andWhere('favoritedUserProfile.username = :favoritedUser', {
          favoritedUser: query.favorited,
        });
    }

    queryBuilder.leftJoinAndSelect(
      'article.favoritedBy',
      'favoriteCheck',
      'favoriteCheck.id = :userId',
      { userId: user.id },
    );

    const [articles, count] = await queryBuilder.getManyAndCount();

    const results = articles.map((article) => {
      const isFavorited =
        Array.isArray(article.favoritedBy) && article.favoritedBy.length > 0;

      return {
        ...article,
        favorited: isFavorited,
      };
    });

    return {
      articles: results,
      articlesCount: count,
    };
  }

  async findOne(slug: string, user: User) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'author.profile'],
    });

    if (!article) {
      throw new NotFoundException(`Article ${slug} not found`);
    }

    const isFavorited = await this.isFavorited(article.id, user.id);

    return {
      ...article,
      favorited: isFavorited,
    };
  }

  async update(slug: string, user: User, updateArticleDto: UpdateArticleDto) {
    const articleToUpdate = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'author.profile'],
    });

    if (!articleToUpdate) {
      throw new NotFoundException(`Article ${slug} not found`);
    }

    const updateArticlePayload = {
      ...updateArticleDto,
      slug: updateArticleDto.title
        ? this.slugify(updateArticleDto.title)
        : articleToUpdate.slug,
    };

    const updatedArticle = this.articleRepository.merge(
      articleToUpdate,
      updateArticlePayload,
    );

    const article = await this.articleRepository.save(updatedArticle);
    const isFavorited = await this.isFavorited(article.id, user.id);

    return {
      ...article,
      favorited: isFavorited,
    };
  }

  async favorite(slug: string, user: User) {
    let article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['favoritedBy', 'author', 'author.profile'],
    });

    if (!article) {
      throw new NotFoundException(`Article ${slug} not found`);
    }

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

  async unfavorite(slug: string, user: User) {
    const foundUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favoritedArticles'],
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID '${user.id}' not found`);
    }

    const articleToUnfavorite = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'author.profile'],
    });

    if (!articleToUnfavorite) {
      throw new NotFoundException(`Article with slug '${slug}' not found`);
    }

    const isFavorited = foundUser.favoritedArticles.some(
      (favArticle) => favArticle.id === articleToUnfavorite.id,
    );

    if (!isFavorited) {
      return {
        ...articleToUnfavorite,
        favorited: isFavorited,
      };
    }

    foundUser.favoritedArticles = foundUser.favoritedArticles.filter(
      (favArticle) => favArticle.id !== articleToUnfavorite.id,
    );
    await this.userRepository.save(foundUser);

    articleToUnfavorite.favoritesCount--;
    const unfavoritedArticle =
      await this.articleRepository.save(articleToUnfavorite);

    return {
      ...unfavoritedArticle,
      favorited: false,
    };
  }

  async remove(slug: string, user: User) {
    let article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (user.id !== article.author.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this article',
      );
    }

    return this.articleRepository.remove(article);
  }

  async isFavorited(articleId: number, userId: number) {
    const isFavorited = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.favoritedBy', 'user')
      .where('article.id = :articleId', { articleId })
      .andWhere('user.id = :userId', { userId })
      .getCount();

    return isFavorited > 0;
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
