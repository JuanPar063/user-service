import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para frontend
  app.enableCors();

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('Documentación de la API del servicio de usuarios')
    .setVersion('1.0.0')
    .addBearerAuth() // soporte para JWT en UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(' User Service running on http://localhost:3000');
  console.log(' Swagger docs at http://localhost:3000/api/docs');
}
bootstrap();
