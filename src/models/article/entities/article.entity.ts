import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from 'src/models/shared/base.entity';
import { User } from '../../user/entities/user.entity';
import { CommentEntity } from 'src/models/comment/entities/comment.entity';

@Entity()
export class Article extends BaseEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column('text', { array: true, default: [] })
  tagList: string[];

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @ManyToMany(() => User, (user) => user.favoritedArticles)
  @Exclude({ toPlainOnly: true })
  favoritedBy: User[];

  @Column({ default: 0 })
  favoritesCount: number;

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];
}
