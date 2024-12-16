import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: Partial<UsersService>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    usersServiceMock = {
      findOne: () => {},
      find: () => {},
      reomove: () => {},
      update: () => {},
    };

    authServiceMock = {
      register: () => {},
      login: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
