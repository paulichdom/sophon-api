import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Article {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
