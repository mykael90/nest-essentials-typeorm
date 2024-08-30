import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { usersRepositoryMock } from '../testing/user-respository.mock';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { userEntityList } from '../testing/user-entity-list-mock';
import { accessTokenMock } from '../testing/access-token.mock';
import { jwtPayloadMock } from '../testing/jwt-payolad.mock';
import { resetTokenMock } from '../testing/reset-token.mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        usersRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeUndefined;
  });

  describe('Token', () => {
    it('should generate token', () => {
      const token = authService.createToken(userEntityList[0]);
      expect(token).toEqual({ accessToken: accessTokenMock });
    });

    it('should check token', () => {
      const token = authService.checkToken(accessTokenMock);
      expect(token).toEqual(jwtPayloadMock);
    });

    it('should be a valid token', () => {
      expect(authService.isValidToken(accessTokenMock)).toBe(true);
    });
  });

  describe('Authentication', () => {
    it('should login', async () => {
      const result = await authService.login({
        email: 'pC7UZ@example.com',
        password: '123456',
      });

      expect(result).toEqual({ accessToken: accessTokenMock });
    });

    it('should forget password', async () => {
      const result = await authService.forget({
        email: 'pC7UZ1@example.com',
      });
      expect(result).toEqual({ success: true });
    });

    it('should reset password', async () => {
      const result = await authService.reset({
        password: '123456',
        token: resetTokenMock,
      });

      expect(result).toEqual({ accessToken: accessTokenMock });
    });
  });
});
