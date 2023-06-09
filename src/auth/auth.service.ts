import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignInInput } from './dto/sign-in.input';
import { LogInInput } from './dto/log-in.input';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async signIn(signInInput: SignInInput) {
    const { email, password, username } = signInInput;

    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create({
      email,
      password: result,
      username,
    });

    return user;
  }

  async logIn(logInInput: LogInInput) {
    const { email, password } = logInInput;
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    user.token = await this.jwtService.signAsync(payload);

    return user;
  }

  async invalidateToken(authToken: string) {
    const token = authToken.split(' ')[1];

    try {
      const client = this.redisService.getClient();
      await client.set(`revoked:${token}`, 'true', 'EX', 60 * 60 * 24);
      // the token is set to expire in 24 hours;
    } catch (error) {
      throw new Error(`Failed to invalidate token: ${error.message}`);
    }

    return true;
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const client = this.redisService.getClient();
    const result = await client.get(`revoked:${token}`);

    return result === 'true';
  }
}
