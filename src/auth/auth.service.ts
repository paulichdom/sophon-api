import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../models/user/user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const usersByEmail = await this.usersService.find(email);
    const usersByUsername = await this.usersService.findByUsername(username);

    if (usersByEmail.length) {
      throw new BadRequestException('Email in use');
    } else if (usersByUsername.length) {
      throw new BadRequestException('Username already exists');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(username, email, result);

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, name: user.username };
    const token = this.jwtService.sign(payload);

    return { user: { ...user, token } };
  }
}
