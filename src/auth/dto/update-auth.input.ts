import { SignUpInput } from './sign-up.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class SignInInput extends PartialType(SignUpInput) {
  @Field(() => Int)
  id: number;
}
