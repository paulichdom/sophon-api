import { MaxLength, MinLength } from 'class-validator';
import { Article } from 'src/models/article/entities/article.entity';
import { BaseEntity } from 'src/models/shared/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'tag' })
export class Tag extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}
