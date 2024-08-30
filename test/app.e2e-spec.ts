import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { authRegisterDTOMock } from '../src/testing/auth-register-dto.mock';
import { Role } from '../src/enums/role.enum';
import dataSource from '../typeorm/data-source';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessTokenMock: string;
  let userId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authRegisterDTOMock);
    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
  });

  it('should login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: authRegisterDTOMock.email,
        password: authRegisterDTOMock.password,
      });
    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');

    accessTokenMock = response.body.accessToken;
  });

  it('should check token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/check-token')
      .set('authorization', `Bearer ${accessTokenMock}`)
      .send();
    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.id).toEqual('number');
    expect(response.body.role).toEqual(Role.User);

    accessTokenMock = response.body.accessToken;
    userId = response.body.id;
  });

  it('dont should register a new user with admin Role', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...authRegisterDTOMock,
        email: 'new@email.com.br',
        role: Role.Admin,
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body.error).toEqual('Bad Request');
  });

  it('dont should list users without admin role', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('authorization', `Bearer ${accessTokenMock}`)
      .send();
    expect(response.statusCode).toEqual(403);
    expect(response.body.error).toEqual('Forbidden');
  });

  it('should swift admin role', async () => {
    const ds = await dataSource.initialize();

    const queryRunner = ds.createQueryRunner();

    await queryRunner.query(`
      UPDATE users SET role = '${Role.Admin}' WHERE id = ${userId};
      `);

    const rows = await queryRunner.query(`
        SELECT * FROM users WHERE id = ${userId};
        `);

    expect(rows.length).toEqual(1);
    expect(rows[0].role).toEqual(Role.Admin);

    queryRunner.release();
    dataSource.destroy();
  });

  it('should login as admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: authRegisterDTOMock.email,
        password: authRegisterDTOMock.password,
      });
    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');

    accessTokenMock = response.body.accessToken;
  });

  it('should list users, using admin role', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('authorization', `Bearer ${accessTokenMock}`)
      .send();
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
