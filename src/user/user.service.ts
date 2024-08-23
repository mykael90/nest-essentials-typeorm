import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor() {}
  async create(data: CreateUserDTO) {
    data.password = await this.hashPassword(data.password);

    return await this.prisma.user.create({
      data,
      // select: {
      //   id: true,
      //   name: true,
      // },
    });
  }

  async list() {
    return await this.prisma.user.findMany();
  }
  async show(id: number) {
    await this.exists(id);
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdatePutUserDTO) {
    3;
    await this.exists(id);
    data.password = await this.hashPassword(data.password);
    return await this.prisma.user.update({ where: { id }, data });
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    await this.exists(id);
    if (data.password) data.password = await this.hashPassword(data.password);
    return await this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.exists(id);
    return await this.prisma.user.delete({ where: { id } });
  }

  async exists(id: number) {
    if (!(await this.prisma.user.count({ where: { id } }))) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
