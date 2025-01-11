/* eslint-disable @typescript-eslint/no-unused-vars */

import { ProfileEntity } from 'src/models/profile/entities/profile.entity';
import { Article } from '../../article/entities/article.entity';
import { Report } from '../../report/entities/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @Column({ nullable: true, default: null })
  token: string | null;

  @OneToOne(() => ProfileEntity, { cascade: true })
  @JoinColumn()
  profile: ProfileEntity;

  @OneToMany(() => Article, (article) => article.author)
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
