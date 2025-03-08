import { Controller, Get } from '@nestjs/common';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { TagService } from './tag.service';
import { TagDto } from './dto/tag.dto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Serialize(TagDto)
  async findAll() {
    const tagList = await this.tagService.getAllTags();
    return { tags: tagList };
  }
}
