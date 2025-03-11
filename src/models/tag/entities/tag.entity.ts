import { Article } from '../../article/entities/article.entity';
import { BaseEntity } from '../../shared/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'tag' })
export class Tag extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}
