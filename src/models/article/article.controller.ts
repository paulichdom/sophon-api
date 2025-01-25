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
import { ArticleListDto } from './dto/article-list.dto';
import { SingleArticleDto } from './dto/single-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(SingleArticleDto)
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
  async findAll(@Query() query, @CurrentUser() user: User,) {
    const { articles, articlesCount } =
      await this.articlesService.findAll(user, query);
    return {
      articles: articles,
      articlesCount: articlesCount,
    };
  }

  @Get('/:slug')
  @Serialize(SingleArticleDto)
  async findOne(@Param('slug') slug: string, @CurrentUser() user: User) {
    const article = await this.articlesService.findOne(slug, user);
    return { article: article };
  }

  // TODO: Handle update issues
  @Put('/:slug')
  @Serialize(SingleArticleDto)
  async update(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = this.articlesService.update(slug, updateArticleDto);
    return { article: updatedArticle };
  }

  @Post('/:slug/favorite')
  @Serialize(SingleArticleDto)
  @UseGuards(AuthGuard)
  async favorite(@Param('slug') slug: string, @CurrentUser() user: User) {
    const favoritedArticle = await this.articlesService.favorite(slug, user);
    return { article: favoritedArticle };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
