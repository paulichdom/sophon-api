import { Injectable, ConflictException } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async getAllTags(): Promise<Tag[]> {
    return this.tagRepository.find();
  }
}
