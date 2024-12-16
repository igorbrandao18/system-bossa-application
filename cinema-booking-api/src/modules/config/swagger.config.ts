import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Cinema Booking API')
  .setDescription('API for cinema booking system')
  .setVersion('1.0')
  .addBearerAuth()
  .build();