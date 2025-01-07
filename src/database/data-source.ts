import { DataSource, DataSourceOptions } from 'typeorm';
 
export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'dev-db.sqlite',
  entities: ['**/*.entity*{.js,.ts}'],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
} as DataSourceOptions);