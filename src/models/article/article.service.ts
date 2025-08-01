import {
  BadRequestException,
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
import { Tag } from '../tag/entities/tag.entity';
import { ArticleProvider } from './article.provider';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    private readonly articleProvider: ArticleProvider,
  ) {}

  async create({ article: articleData }: CreateArticleDto, user: User) {
    let tags = [];

    if (articleData.tagList && articleData.tagList.length > 0) {
      for (const tag of articleData.tagList) {
        tags.push(await this.createOrGetTag(tag));
      }
    }

    const newArticle = this.articleRepository.create({
      ...articleData,
      author: user,
      slug: this.slugify(articleData.title),
      tags,
    });

    const savedArticle = await this.articleRepository.save(newArticle);

    return {
      ...savedArticle,
      favorited: false,
    };
  }

  async findAll(user: User, query?: Record<string, string>) {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    queryBuilder
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('article.tags', 'tags');

    if ('author' in query) {
      queryBuilder.andWhere('profile.username = :username', {
        username: query.author,
      });
    }

    if ('tag' in query) {
      queryBuilder
        .innerJoin('article.tags', 'filterTag')
        .andWhere('filterTag.name = :tag', { tag: query.tag });
    }

    if ('favorited' in query) {
      queryBuilder
        .innerJoin('article.favoritedBy', 'favoritedUser')
        .innerJoin('favoritedUser.profile', 'favoritedUserProfile')
        .andWhere('favoritedUserProfile.username = :favoritedUser', {
          favoritedUser: query.favorited,
        });
    }

    if (user) {
      queryBuilder.leftJoinAndSelect(
        'article.favoritedBy',
        'favoriteCheck',
        'favoriteCheck.id = :userId',
        { userId: user.id },
      );
    } else {
      queryBuilder.leftJoinAndSelect('article.favoritedBy', 'favoriteCheck');
    }

    const [articles, count] = await queryBuilder.getManyAndCount();

    const results = articles.map((article) => {
      const isFavorited = user
        ? Array.isArray(article.favoritedBy) && article.favoritedBy.length > 0
        : false;

      return {
        ...article,
        favorited: isFavorited,
      };
    });

    console.log({ user, results });

    return {
      articles: results,
      articlesCount: count,
    };
  }

  async findOne(slug: string, user?: User) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['tags', 'author', 'author.profile'],
    });

    if (!article) {
      throw new NotFoundException(`Article ${slug} not found`);
    }

    const isFavorited = user
      ? await this.isFavorited(article.id, user.id)
      : false;

    return {
      ...article,
      favorited: isFavorited,
    };
  }

  async update(
    slug: string,
    user: User,
    { article: articleData }: UpdateArticleDto,
  ) {
    const articleToUpdate = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'author.profile', 'tags'],
    });

    if (!articleToUpdate) {
      throw new NotFoundException(`Article ${slug} not found`);
    }

    const updateArticlePayload = {
      ...articleData,
      slug: articleData.title
        ? this.slugify(articleData.title)
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
      relations: ['favoritedBy', 'author', 'author.profile', 'tags'],
    });

    article.author.id

    if (!article) {
      throw new NotFoundException(`Article ${slug} not found`);
    }

    if(article.author.id === user.id) {
      throw new ForbiddenException("You can't favorite your own article");
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
      relations: ['author', 'author.profile', 'tags'],
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
    // TODO: Allow delete if there are comments? Or throw ConflictException
    let article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tags'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (user.id !== article.author.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this article',
      );
    }

    return await this.articleRepository.remove(article);
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

  async createOrGetTag(tagName: string): Promise<Tag> {
    const name = tagName.trim().toLowerCase();
    let tag = await this.tagRepository.findOne({ where: { name } });

    if (!tag) {
      const newTag = this.tagRepository.create({
        name,
      });
      tag = await this.tagRepository.save(newTag);
    }

    return tag;
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

  async generate(prompt: string) {
    return this.articleProvider.generateArticleObject(prompt);
  }
}
