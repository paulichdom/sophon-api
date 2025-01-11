import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../../auth/auth.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UserController;
  let usersServiceMock: Partial<UserService>;
  let authServiceMock: Partial<AuthService>;

  const usernameMock = 'Joe';
  const emailMock = 'joe@work.com';
  const passwordMock = 'joeMakesP4ssw0rd';

  beforeEach(async () => {
    usersServiceMock = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          username: usernameMock,
          email: emailMock,
          password: passwordMock,
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: passwordMock } as User,
        ]);
      },
    };

    authServiceMock = {
      login: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: usersServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers(emailMock);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(emailMock);
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    usersServiceMock.findOne = () => null;

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('login updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.login(
      { email: emailMock, password: passwordMock },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
