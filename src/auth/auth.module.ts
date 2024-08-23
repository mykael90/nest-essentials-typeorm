import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    forwardRef(() => UserModule),
    FileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
