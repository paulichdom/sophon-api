import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
dotenv.config({ path: envFile });

const isProd = process.env.NODE_ENV === 'production';

export const appDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: isProd ? {
    rejectUnauthorized: false,
  } : false,
  entities: ['**/*.entity*{.js,.ts}'],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
} as DataSourceOptions);
