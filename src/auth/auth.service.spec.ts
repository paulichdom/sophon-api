import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;

  let usernameMock: string;
  let emailMock: string;
  let passwordMock: string;

  beforeEach(async () => {
    const users: User[] = [];
    usersServiceMock = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (username: string, email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          username,
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    usernameMock = 'Joe';
    emailMock = 'joe@work.com';
    passwordMock = 'joeMakesP4ssw0rd';

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.register(usernameMock, emailMock, passwordMock);
    expect(user.password).not.toEqual(passwordMock);

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is already in use', async () => {
    await service.register(usernameMock, emailMock, passwordMock);

    await expect(
      service.register(usernameMock, emailMock, passwordMock),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws error if login is called with unused email', async () => {
    await expect(
      service.login('unused.email@void.com', passwordMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws error if an invalid password is provided', async () => {
    await service.register(usernameMock, emailMock, passwordMock);

    await expect(service.login(emailMock, 'invalidPassword')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.register(usernameMock, emailMock, passwordMock);

    const user = await service.login(emailMock, passwordMock);
    expect(user).toBeDefined();
  });
});
