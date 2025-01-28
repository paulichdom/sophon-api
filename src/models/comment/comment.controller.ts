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
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('articles')
@UseGuards(AuthGuard)
@Serialize(CommentDto)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:slug/comments')
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

  @Get()
  findAll() {
    return this.commentService.findAll();
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
