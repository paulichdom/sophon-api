import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
