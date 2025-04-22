import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';

import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { ArticleService } from './article.service';
import { User } from '../user/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { ArticleDto, ArticleListDto } from './dto/article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ArticleDto)
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ) {
    const newArticle = await this.articlesService.create(
      createArticleDto,
      user,
    );
    return { article: newArticle };
  }

  @Get()
  @Serialize(ArticleListDto)
  async findAll(@Query() query, @CurrentUser() user: User) {
    const { articles, articlesCount } = await this.articlesService.findAll(
      user,
      query,
    );
    return {
      articles: articles,
      articlesCount: articlesCount,
    };
  }

  @Get('/:slug')
  @Serialize(ArticleDto)
  async findOne(@Param('slug') slug: string, @CurrentUser() user: User) {
    const article = await this.articlesService.findOne(slug, user);
    return { article: article };
  }

  @Put('/:slug')
  @Serialize(ArticleDto)
  async update(
    @Param('slug') slug: string,
    @CurrentUser() user: User,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = await this.articlesService.update(
      slug,
      user,
      updateArticleDto,
    );
    return { article: updatedArticle };
  }

  @Post('/:slug/favorite')
  @Serialize(ArticleDto)
  @UseGuards(AuthGuard)
  async favorite(@Param('slug') slug: string, @CurrentUser() user: User) {
    const favoritedArticle = await this.articlesService.favorite(slug, user);
    return { article: favoritedArticle };
  }

  @Delete('/:slug/favorite')
  @Serialize(ArticleDto)
  @UseGuards(AuthGuard)
  async unfavorite(@Param('slug') slug: string, @CurrentUser() user: User) {
    const unfavoritedArticle = await this.articlesService.unfavorite(
      slug,
      user,
    );
    return { article: unfavoritedArticle };
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  @Serialize(ArticleDto)
  async remove(@Param('slug') slug: string, @CurrentUser() user: User) {
    const deletedArticle = await this.articlesService.remove(slug, user);
    return { article: deletedArticle };
  }

  @Post('/generate')
  @UseGuards(AuthGuard)
  async generate(@Body() body: { prompt: string }) {
    return await this.articlesService.generate(body.prompt);
  }
}
