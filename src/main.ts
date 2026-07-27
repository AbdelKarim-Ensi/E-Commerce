import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

async function bootstrap() {
const app = await NestFactory.create(AppModule, { rawBody: true });  const config = app.get(ConfigService);

  // --- A05: Security Misconfiguration — Helmet sets a batch of protective headers ---
  app.use(
    helmet({
      // CSP is strict by default; only relax this if you serve HTML/inline scripts
      // from this API directly (rare for a pure JSON API like this one).
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"], // extra clickjacking protection beyond X-Frame-Options
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
      // HSTS: forces HTTPS on every future request for 1 year, including subdomains.
      // Only actually enforced by browsers over HTTPS — harmless in local HTTP dev.
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // --- Cookies must be parsed before guards/strategies that read req.cookies ---
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
}
bootstrap();