import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const usersServiceMock: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const usenameMock = 'Joe';
    const emalMock = 'joe@work.com';
    const passwordMock = 'joeMakesP4ssw0rd';

    const user = await service.register(usenameMock, emalMock, passwordMock);
    expect(user.password).not.toEqual(passwordMock);

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
});
