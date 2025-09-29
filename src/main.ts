import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para que funcione con frontend
  app.enableCors();
  
  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('Documentación de la API del servicio de usuarios')
    .setVersion('1.0')
    .addBearerAuth() // quítalo si no usas JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(' User Service running on http://localhost:3000');
  console.log(' Swagger docs available at http://localhost:3000/api/docs');
}
bootstrap();
