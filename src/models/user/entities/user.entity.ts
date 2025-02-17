import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Article } from '../../article/entities/article.entity';
import { Report } from '../../report/entities/report.entity';
import { ProfileEntity } from '../../profile/entities/profile.entity';
import { RoleEntity } from '../../role/entities/role.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { BaseEntity } from '../../shared/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({nullable: true})
  username: string;

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

  @ManyToMany(() => Article, (article) => article.favoritedBy, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'user_favorited_articles' })
  favoritedArticles: Article[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @ManyToMany(() => User, user => user.followers)
  @JoinTable({ 
    name: 'user_followers',
    joinColumn: { name: 'followingId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'followerId', referencedColumnName: 'id' },
  })
  following: User[];

  @ManyToMany(() => User, user => user.following)
  followers: User[];
}
