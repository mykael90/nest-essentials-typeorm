import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ path: process.env.ENV === 'test' ? '.env.test' : '.env' });

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  //   logging: false,
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
});

export default dataSource;
