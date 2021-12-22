import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // main config
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('NTF Ticketing')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalInterceptors(new LoggingInterceptor());

  // config port
  const configService = app.select(ConfigModule).get(ConfigService);
  await app.listen(configService.get('port'));
}
bootstrap().then(() => {
  console.log('Started');
});
