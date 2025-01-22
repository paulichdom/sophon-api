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
  createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ) {
    return this.articlesService.create(createArticleDto, user);
  }

  @Get()
  @Serialize(ArticleListDto)
  findAll(@Query() query) {
    return this.articlesService.findAll(query);
  }

  @Get('/:slug')
  @Serialize(SingleArticleDto)
  findOne(@Param('slug') slug: string) {
    return this.articlesService.findOne(slug);
  }

  @Put('/:slug')
  update(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(slug, updateArticleDto);
  }

  @Post('/:slug/favorite')
  @UseGuards(AuthGuard)
  @Serialize(SingleArticleDto)
  favorite(
    @Param('slug') slug: string,
    @CurrentUser() user: User,
  ) {
    return this.articlesService.favorite(slug, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
