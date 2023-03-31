import { SignUpInput } from './sign-up.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class SignInInput extends PartialType(SignUpInput) {}
