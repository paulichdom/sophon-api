import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const env = this.configService.get('NODE_ENV');
    const isTest = env === 'test';
    const isProd = env === 'production';

    const migrationsRun = isTest || isProd;
    const migrationsPath = 'src/database/migrations/*{.js,.ts}';

    const baseConfig: TypeOrmModuleOptions = {
      type: 'postgres',
      database: this.configService.get('DB_NAME'),
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      ssl: !isProd
        ? false
        : {
          rejectUnauthorized: false,
        },
      autoLoadEntities: true,
      synchronize: !isProd,
      migrationsRun: migrationsRun,
      migrations: migrationsRun
        ? [process.cwd() + `/${migrationsPath}`]
        : [],
      keepConnectionAlive: isTest,
    };

    return baseConfig;
  }
}
