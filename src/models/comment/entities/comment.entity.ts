import { Column, Entity, ManyToOne } from "typeorm";

import { BaseEntity } from "../../shared/base.entity";
import { User } from "../../user/entities/user.entity";
import { Article } from "../../article/entities/article.entity";

@Entity({name: 'comment'})
export class CommentEntity extends BaseEntity {
  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: User

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE'
  })
  article: Article;
}
