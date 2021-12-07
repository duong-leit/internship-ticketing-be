import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ACTION_RECAPTCHA, SCORE_RECAPTCHA } from 'src/common/constant';

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
  },
  recaptchaSecretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
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
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    autoLoadEntities: configService.get('database.autoLoadEntities'),
    synchronize: configService.get('database.sync'),
  }),
};

export const googleRecatpChaModule = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    console.log(configService);
    return {
      secretKey: configService.get('recaptchaSecretKey'),
      response: (req) => (req.headers.recaptcha || '').toString(),
      // skipIf: process.env.NODE_ENV !== 'production',
      actions: ACTION_RECAPTCHA,
      score: SCORE_RECAPTCHA,
    };
  },
  inject: [ConfigService],
};
