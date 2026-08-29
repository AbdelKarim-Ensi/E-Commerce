
import * as Sentry from '@sentry/nestjs';
import compression from 'compression';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
});


import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"], 
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  app.use(cookieParser());

  const corsOrigins = config
    .get<string>('CORS_ORIGIN', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true, 
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true,
    }),
  );
  app.use(compression());

 
  app.useGlobalFilters(new PrismaExceptionFilter());

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
void bootstrap();