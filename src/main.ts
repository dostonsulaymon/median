import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));
  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Use 'dev' format for development

  // Setup Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Change to '/docs' if needed

  // Start the application
  await app.listen(PORT);
  console.log(`Server started on port ${PORT}`);
}

bootstrap();
