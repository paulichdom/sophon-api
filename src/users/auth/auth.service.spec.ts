import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;

  let usernameMock: string;
  let emailMock: string;
  let passwordMock: string;
  let hashedPasswordMock: string;

  beforeEach(async () => {
    usersServiceMock = {
      find: () => Promise.resolve([]),
      create: (username: string, email: string, password: string) =>
        Promise.resolve({ id: 1, username, email, password } as User),
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
    hashedPasswordMock =
      '85b2c83da50ebb2e.c061313b9af75ccd2b6082ce9d6e7549d33e2eab9d198ddb10793c3c381d833d';

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
    usersServiceMock.find = () =>
      Promise.resolve([
        {
          id: 1,
          username: usernameMock,
          email: emailMock,
          password: passwordMock,
        } as User,
      ]);

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
    usersServiceMock.find = () =>
      Promise.resolve([{ email: emailMock, password: passwordMock } as User]);

    await expect(service.login(emailMock, 'wrongPassword')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    usersServiceMock.find = () =>
      Promise.resolve([
        { email: emailMock, password: hashedPasswordMock } as User,
      ]);

    const user = await service.login(emailMock, passwordMock);
    expect(user).toBeDefined();
  });
});
