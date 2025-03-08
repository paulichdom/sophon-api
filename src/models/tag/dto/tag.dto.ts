import { Expose, Transform } from 'class-transformer';

export class TagData {
  id: number;
  name: string;
}

export class TagDto {
  @Expose()
  @Transform(({ obj }) => obj.tags.map((tag) => tag.name))
  tags: string[];
}
