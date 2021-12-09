import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ssl: process.env.DATABASE_SSL === 'true',
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  recaptchaSecretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
  facebookClientId: process.env.CLIENT_ID,
  facebookClientSecret: process.env.CLIENT_SECRET,
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

export const googleRecaptchaModuleOption = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    secretKey: configService.get('recaptchaSecretKey'),
    response: (req) => (req.headers.recaptcha || '').toString(),
    skipIf: process.env.NODE_ENV !== 'production',
    actions: ACTION_RECAPTCHA,
    score: SCORE_RECAPTCHA,
  }),
  inject: [ConfigService],
};

export const facebookAuthModuleOption = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    clientId: configService.get('facebookClientId'), //CLIENT_ID,
    clientSecret: configService.get('facebookClientSecret'), //CLIENT_SECRET,
  }),
  inject: [ConfigService],
};

export const jwtModuleOption = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    console.log(configService);
    return {
      secret: configService.get<string>('jwtSecretKey'),
      signOptions: { expiresIn: '7d' },
    };
  },
  inject: [ConfigService],
};
