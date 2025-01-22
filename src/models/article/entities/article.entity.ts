import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column('simple-array', { default: '' })
  tagList: string[];

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @ManyToMany(() => User, (user) => user.favoritedArticles)
  @Exclude({ toPlainOnly: true })
  favoritedBy: User[];

  @Column({ default: 0 })
  favoritesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
