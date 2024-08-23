import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  private readonly issuer = 'login';
  private readonly audience = 'users';
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}

  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  createTokenForgetPassword(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
        },
        {
          expiresIn: '30 minutes',
          subject: String(user.id),
          issuer: 'forget',
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });
      return data;
    } catch (e) {
      throw new UnauthorizedException(`Token inválido!`);
    }
  }
  checkTokenForgetPassword(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: 'forget',
      });
      return data;
    } catch (e) {
      throw new UnauthorizedException(`Token inválido!`);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(data: AuthLoginDTO) {
    // const user = await this.prisma.user.findFirst({
    //   where: { email: data.email },
    // });
    // if (!user) {
    //   throw new UnauthorizedException(`E-mail e/ou senha inválidos!`);
    // }
    // const isPasswordCorrect = await bcrypt.compare(
    //   data.password,
    //   user.password,
    // );
    // if (!isPasswordCorrect) {
    //   throw new UnauthorizedException(`E-mail e/ou senha inválidos!`);
    // }
    // return this.createToken(user);
  }

  async forget(data: AuthForgetDTO) {
    // const user = await this.prisma.user.findFirst({
    //   where: { email: data.email },
    // });
    // if (!user) {
    //   throw new UnauthorizedException(`E-mail inválido!`);
    // }
    // const token = this.createTokenForgetPassword(user).accessToken;
    // await this.mailer.sendMail({
    //   to: user.email,
    //   subject: 'Redefinir senha',
    //   template: 'forget',
    //   context: {
    //     name: user.name,
    //     token,
    //   },
    // });
    // return true;
  }

  async reset(data: AuthResetDTO) {
    // const token = this.checkTokenForgetPassword(data.token);
    // const { id } = token;
    // try {
    //   const salt = await bcrypt.genSalt();
    //   const password = await bcrypt.hash(data.password, salt);
    //   const user = await this.prisma.user.update({
    //     where: { id },
    //     data: { password },
    //   });
    //   return this.createToken(user);
    // } catch (e) {
    //   throw new BadRequestException(e);
    // }
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
