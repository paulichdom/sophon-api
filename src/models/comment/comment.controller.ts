import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { CommentDto, CommentListDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('articles')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:slug/comments')
  @UseGuards(AuthGuard)
  @Serialize(CommentDto)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('slug') slug: string,
    @CurrentUser() user: User,
  ) {
    const comment = await this.commentService.create(
      createCommentDto,
      slug,
      user,
    );

    return { comment: comment };
  }

  @Get('/:slug/comments')
  @Serialize(CommentListDto)
  async findAll(@Param('slug') slug: string) {
    const comments = await this.commentService.findAll(slug);
    return {comments: comments }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
