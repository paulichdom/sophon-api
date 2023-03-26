import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  email: string;

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
