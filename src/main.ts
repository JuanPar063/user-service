import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS CONFIGURADO CORRECTAMENTE - MUY IMPORTANTE
  app.enableCors({
    origin: [
      'http://localhost:3004',  // Frontend React
      'http://localhost:3002',  // Alternativa del frontend
      'http://localhost:3000',  // Por si acaso
      'http://localhost:3001',  // Auth service
      'http://localhost:3003',  // Admin service
      'http://localhost:3005',  // Gateway
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('Documentación de la API del servicio de usuarios (Profiles)')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // ✅ IMPORTANTE: Escuchar en todas las interfaces
  
  console.log('='.repeat(60));
  console.log(`✅ User Service running on http://localhost:${port}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS habilitado para frontend en puerto 3004`);
  console.log('='.repeat(60));
}
bootstrap();