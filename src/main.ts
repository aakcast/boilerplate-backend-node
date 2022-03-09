import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fastifyCsrf from 'fastify-csrf';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/filters/exception.filter';

/**
 * Application entry point
 */
async function bootstrap() {
  const serverApp = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, serverApp);

  // Enable CORS
  app.enableCors();

  // Register fastify plugins
  await Promise.all([
    // CSRF protection
    app.register(fastifyCsrf),
  ]);

  // Set API version
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // Set global pipe for validation
  app.useGlobalPipes(new ValidationPipe());
  // Set global exception filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Boilerplate for Node.js backend')
    .setDescription('Node.js boilerplate project for creating a new backend(BFF) more faster.')
    .setVersion('1.0')
    .addTag('App', '앱 기본 기능')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start listening requests
  await app.listen(3000);
}
bootstrap();
