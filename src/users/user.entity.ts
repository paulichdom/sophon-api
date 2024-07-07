/* eslint-disable @typescript-eslint/no-unused-vars */
import { Article } from 'src/articles/article.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  token: string | null;

  @Column({ nullable: true, default: null })
  bio: string | null;

  @Column({ nullable: true, default: null })
  image: string | null;

  @OneToMany((_type) => Article, (article) => article.author)
  articles: Article[];
}
