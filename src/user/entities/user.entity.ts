import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  image: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  token: string;

  @AfterInsert()
  logInsert() {
    console.log(`Inserted user with id: '${this.id}'`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user with id: '${this.id}'`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed user with id: '${this.id}'`);
  }
}
