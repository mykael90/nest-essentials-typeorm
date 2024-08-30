import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { AuthService } from './auth.service';
import { userEntityList } from '../testing/user-entity-list-mock';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { updatePutUserDTO } from '../testing/update-put-user-dto-mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';
import { authServiceMock } from '../testing/auth-service.mock';
import { fileServiceMock } from '../testing/file-service.mock';
import { accessTokenMock } from '../testing/access-token.mock';
import { authLoginDTOMock } from '../testing/auth-login-dto.mock';
import { authRegisterDTOMock } from '../testing/auth-register-dto.mock';
import { authForgetDTOMock } from '../testing/auth-forget-dto.mock';
import { authResetDTOMock } from '../testing/auth-reset-dto.mock';
import { getPhoto } from '../testing/get-photo.mock';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock, fileServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('Flows for auth', () => {
    it('should login', async () => {
      const result = await authController.login(authLoginDTOMock);
      expect(result).toEqual({ accessToken: accessTokenMock });
    });

    it('should register a new user', async () => {
      const result = await authController.register(authRegisterDTOMock);
      expect(result).toEqual({ accessToken: accessTokenMock });
    });

    it('should forget password', async () => {
      const result = await authController.forget(authForgetDTOMock);
      expect(result).toEqual({ success: true });
    });

    it('should reset password', async () => {
      const result = await authController.reset(authResetDTOMock);
      expect(result).toEqual({ accessToken: accessTokenMock });
    });
  });

  describe('Authenticated routes', () => {
    it('should check token', async () => {
      const result = await authController.checkToken(userEntityList[0]);
      expect(result).toEqual(userEntityList[0]);
    });

    it('should upload photo', async () => {
      const photo = await getPhoto();
      const result = await authController.uploadPhoto('1', photo, 'photo test');
      expect(result).toEqual({ title: 'photo test', id: '1', success: true });
    });

    //TODO test for multiple photos upload
  });
});
