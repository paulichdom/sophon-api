import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { Auth } from './entities/auth.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signUpUser(@Args('signUpInput') signUpInput: SignUpInput) {
    const user = await this.authService.signUp(signUpInput);
    return user;
  }

  @Query(() => User)
  async signInUser(@Args('signInInput') signInInput: SignInInput) {
    const user = await this.authService.signIn(signInInput);
    return user;
  }
}
