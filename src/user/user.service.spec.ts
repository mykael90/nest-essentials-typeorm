import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { usersRepositoryMock } from '../testing/user-respository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { userEntityList } from '../testing/user-entity-list-mock';
import { updatePutUserDTO } from '../testing/update-put-user-dto-mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, usersRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should create user', async () => {
    jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(false);

    const result = await userService.create(createUserDTO);

    expect(result).toEqual(userEntityList[0]);
  });

  it('should list users', async () => {
    const result = await userService.list();
    expect(result).toEqual(userEntityList);
  });

  it('should show user', async () => {
    const result = await userService.show(1);
    expect(result).toEqual(userEntityList[0]);
  });

  it('should update user', async () => {
    const result = await userService.update(1, updatePutUserDTO);
    expect(result).toEqual(userEntityList[0]);
  });

  it('should update partial user', async () => {
    const result = await userService.updatePartial(1, updatePatchUserDTO);
    expect(result).toEqual(userEntityList[0]);
  });

  it('should delete user', async () => {
    const result = await userService.delete(1);
    expect(result).toEqual({ deleted: true });
  });
});
