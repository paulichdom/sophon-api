import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LogInInput } from './dto/log-in.input';
import { SignInInput } from './dto/sign-in.input';
import { Auth } from './entities/auth.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signInUser(@Args('signInInput') signInInput: SignInInput) {
    const user = await this.authService.signIn(signInInput);
    return user;
  }

  @Query(() => User)
  async logInUser(@Args('logInInput') logInInput: LogInInput) {
    const user = await this.authService.logIn(logInInput);
    return user;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async logOutUser(@Context() context) {
    const { authorization } = context.req.headers;
    await this.authService.invalidateToken(authorization);
    return 'Logged out successfully';
  }
}
