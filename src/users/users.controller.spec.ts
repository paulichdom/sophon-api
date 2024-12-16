import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: Partial<UsersService>;
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
      /* remove: () => {},
      update: () => {}, */
    };

    authServiceMock = {
      /* register: () => {},
      login: () => {}, */
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
