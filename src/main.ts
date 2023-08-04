import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpInterceptor } from './core/utils/decorators/http.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('The FBM API description aaabbbcccddd')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'token',
    )
    .addTag('api')
    .build();
  app.setGlobalPrefix('api/v1');
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.useGlobalInterceptors(new HttpInterceptor());
  const configService = app.get(ConfigService);
  await app.listen(parseInt(configService.get<string>('PORT')), '0.0.0.0');
}
bootstrap();
