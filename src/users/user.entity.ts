/* eslint-disable @typescript-eslint/no-unused-vars */
import { Article } from 'src/articles/article.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  token: string;

  @Column()
  bio: string;

  @Column()
  image: string | null;

  @OneToMany((_type) => Article, (article) => article.author)
  articles: Article[];
}
