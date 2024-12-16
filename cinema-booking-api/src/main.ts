import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do CORS
  app.enableCors();
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Cinema Booking API')
    .setDescription('API for cinema booking system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Pipes globais
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Prefixo global da API
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap(); 