/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column('simple-array')
  taglist: string[];

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @Column()
  favorited: boolean;

  @Column()
  favoritesCount: number;

  @ManyToOne((_type) => User, (user) => user.articles)
  author: User;
}
