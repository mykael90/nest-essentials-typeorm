import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(data: CreateUserDTO) {
    if (
      await this.usersRepository.exist({
        where: {
          email: data.email,
        },
      })
    ) {
      throw new BadRequestException('Este e-mail já está sendo usado.');
    }

    data.password = await this.hashPassword(data.password);

    const user = this.usersRepository.create(data);

    return this.usersRepository.save(user);
  }

  async list() {
    return this.usersRepository.find();
  }
  async show(id: number) {
    await this.exists(id);
    return await this.show(id);
  }

  async update(id: number, data: UpdatePutUserDTO) {
    3;
    await this.exists(id);
    data.password = await this.hashPassword(data.password);
    await this.usersRepository.update(id, { ...data });
    return await this.show(id);
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    await this.exists(id);
    if (data.password) data.password = await this.hashPassword(data.password);
    await this.usersRepository.update(id, { ...data });
    return await this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);
    console.log('User exists');
    await this.usersRepository.delete(id);
    console.log('User deleted');
    return { deleted: true };
  }

  async exists(id: number) {
    if (!(await this.usersRepository.exists({ where: { id } }))) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
