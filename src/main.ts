import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

async function bootstrap() {
const app = await NestFactory.create(AppModule, { rawBody: true });  const config = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"], // extra clickjacking protection beyond X-Frame-Options
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  app.use(cookieParser());

  // --- CORS: only the Angular dev/prod origin may call this API with credentials ---
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN'), // e.g. http://localhost:4200
    credentials: true, // required so the browser sends/receives the httpOnly cookies
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // --- Global input validation (already used per-DTO, enforced app-wide here too) ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not defined in the DTO
      forbidNonWhitelisted: true, // rejects the request instead of silently dropping extras
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();