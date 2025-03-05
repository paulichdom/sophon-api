import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../shared/base.entity';
import { User } from '../../user/entities/user.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { Tag } from 'src/models/tag/entities/tag.entity';

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

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @ManyToMany(() => User, (user) => user.favoritedArticles)
  @Exclude({ toPlainOnly: true })
  favoritedBy: User[];

  @Column({ default: 0 })
  favoritesCount: number;

  @OneToMany(() => CommentEntity, (comment) => comment.article, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];
}
