/* eslint-disable @typescript-eslint/no-unused-vars */
import { Article } from 'src/articles/article.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, default: null })
  token: string | null;

  @Column({ nullable: true, default: null })
  bio: string | null;

  @Column({ nullable: true, default: null })
  image: string | null;

  @OneToMany((_type) => Article, (article) => article.author)
  articles: Article[];

  @AfterInsert()
  logInsert() {
    console.info('Inserted User with id', this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.info('Updated User with id', this.id);
  }
  @AfterRemove()
  logRemove() {
    console.info('Removed User with id', this.id);
  }
}
