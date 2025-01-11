
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  body: string;

  @Column('simple-array', {default: ''})
  tagList: string[];

  @Column({default: false})
  favorited: boolean;

  @Column({default: 0})
  favoritesCount: number;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @CreateDateColumn({type: 'datetime'})
  createdAt: Date;

  @UpdateDateColumn({type: 'datetime'})
  updatedAt: Date;
}
