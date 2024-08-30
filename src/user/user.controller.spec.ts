import { Test, TestingModule } from '@nestjs/testing';
import { userServiceMock } from '../testing/user-service.mock';
import { UserController } from './user.controller';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { RoleGuard } from '../guards/role.guard';
import { UserService } from './user.service';
import { userEntityList } from '../testing/user-entity-list-mock';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { updatePutUserDTO } from '../testing/update-put-user-dto-mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(RoleGuard)
      .useValue(guardMock)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Guards in the controller', () => {
    it('should use AuthGuard and RoleGuard correctly', () => {
      const guards = Reflect.getMetadata('__guards__', UserController);
      expect(guards.length).toEqual(2);
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
      expect(new guards[1]()).toBeInstanceOf(RoleGuard);
    });
  });

  describe('CRUD', () => {
    it('should list users', async () => {
      const result = await userController.list();
      expect(result).toEqual(userEntityList);
    });

    it('should show user', async () => {
      const result = await userController.show(1);
      expect(result).toEqual(userEntityList[0]);
    });

    it('should create user', async () => {
      const result = await userController.create(createUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });

    it('should update user', async () => {
      const result = await userController.updateAll(1, updatePutUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });

    it('should update partial user', async () => {
      const result = await userController.update(1, updatePatchUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });

    it('should delete user', async () => {
      const result = await userController.delete(1);
      expect(result).toEqual({ deleted: true });
    });
  });
});
