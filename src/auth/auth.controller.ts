import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user-decorator';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { join } from 'path';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() body: AuthForgetDTO) {
    return this.authService.forget(body);
  }

  @Post('reset')
  async reset(@Body() body: AuthResetDTO) {
    return this.authService.reset(body);
  }

  @UseGuards(AuthGuard)
  @Post('check-token')
  async checkToken(@User(['id', 'name', 'email', 'role']) user: CreateUserDTO) {
    return user;
  }

  @UseInterceptors(FileInterceptor('photo'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image' }),
          // 2MB
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
      }),
    )
    photo: Express.Multer.File,
    @Body('title') title: string,
  ) {
    function getDestinationDirectory() {
      return join(__dirname, '..', '..', '..', 'storage', 'photos');
    }
    const fileName = `photo-${id}-${Date.now()}.jpg`;
    const path = join(getDestinationDirectory(), fileName);

    console.log('path', path);

    try {
      await this.fileService.upload(photo, path);
    } catch (e) {
      return new BadRequestException(e);
    }

    return { title, id, success: true };
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(
    @User('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return { files };
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 10 },
      { name: 'documents', maxCount: 2 },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('files-field')
  async uploadFilesField(
    @User('id') id: string,
    @UploadedFiles()
    files: { photos: Express.Multer.File[]; documents: Express.Multer.File[] },
  ) {
    return { files };
  }
}
