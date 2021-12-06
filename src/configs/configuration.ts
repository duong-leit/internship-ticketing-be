import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: `${process.env.DATABASE_PASSWORD}`,
    sync: process.env.DATABASE_SYNCHRONIZE === 'true',
    autoLoadEntities: process.env.DATABASE_AUTOLOADENTITIES === 'true',
    ssl: process.env.DATABASE_SSL === 'true',
  },
});

export const typeormModuleOption: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('database.host'),
    port: +configService.get('database.port'),
    username: configService.get('database.user'),
    password: configService.get('database.password'),
    database: configService.get('database.name'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    autoLoadEntities: configService.get('database.autoLoadEntities'),
    synchronize: configService.get('database.sync'),
    ssl: configService.get('database.ssl'),
    extra:
      configService.get('database.ssl') === true
        ? {
            ssl: { rejectUnauthorized: false },
          }
        : {},
  }),
};
