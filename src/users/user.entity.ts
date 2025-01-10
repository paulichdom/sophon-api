/* eslint-disable @typescript-eslint/no-unused-vars */

import { Article } from 'src/articles/entities/article.entity';
import { Report } from '../reports/entities/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column()
  admin: boolean;

  @Column({ nullable: true, default: null })
  token: string | null;

  @Column({ nullable: true, default: null })
  bio: string | null;

  @Column({ nullable: true, default: null })
  image: string | null;

  @OneToMany((_type) => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
