import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Article } from '../../article/entities/article.entity';
import { Report } from '../../report/entities/report.entity';
import { ProfileEntity } from '../../profile/entities/profile.entity';
import { RoleEntity } from '../../role/entities/role.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @ManyToMany(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: RoleEntity[];

  @Column({ nullable: true, default: null })
  token: string | null;

  @OneToOne(() => ProfileEntity, { cascade: true })
  @JoinColumn()
  profile: ProfileEntity;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @ManyToMany(() => Article, (article) => article.favoritedBy, {
    cascade: true,
  })
  @JoinTable({ name: 'user_favorited_articles' })
  favoritedArticles: Article[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
