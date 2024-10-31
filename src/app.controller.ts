import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './exception_filters/http-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseFilters(HttpExceptionFilter)
  getHello(): string {
    throw new BadRequestException('Something bad happened', {
      cause: new Error(),
      description: 'Some error description',
    });
    // return this.appService.getHello();
  }
  @Post()
  setHello(): string {
    return 'POST: Hello World!';
  }
}
