import { AuthResetDTO } from '../auth/dto/auth-reset.dto';
import { resetTokenMock } from './reset-token.mock';

export const authResetDTOMock: AuthResetDTO = {
  password: '123456',
  token: resetTokenMock,
};
