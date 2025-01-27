import { Column, Entity, ManyToOne } from "typeorm";

import { BaseEntity } from "src/models/shared/base.entity";
import { User } from "src/models/user/entities/user.entity";
import { Article } from "src/models/article/entities/article.entity";

@Entity({name: 'comment'})
export class CommentEntity extends BaseEntity {
  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: User

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;
}
