import { AuthService } from '../auth/auth.service';
import { accessTokenMock } from './access-token.mock';
import { jwtPayloadMock } from './jwt-payolad.mock';
import { resetTokenMock } from './reset-token.mock';

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    createToken: jest.fn().mockReturnValue({ accessToken: accessTokenMock }),
    createTokenForgetPassword: jest.fn().mockReturnValue(resetTokenMock),
    checkToken: jest.fn().mockReturnValue(jwtPayloadMock),
    checkTokenForgetPassword: jest.fn().mockReturnValue(jwtPayloadMock),
    isValidToken: jest.fn().mockReturnValue(true),
    login: jest.fn().mockResolvedValue({ accessToken: accessTokenMock }),
    forget: jest.fn().mockResolvedValue({
      success: true,
    }),
    reset: jest.fn().mockResolvedValue({ accessToken: accessTokenMock }),
    register: jest.fn().mockResolvedValue({ accessToken: accessTokenMock }),
  },
};
