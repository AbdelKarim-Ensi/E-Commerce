import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';

// Every env var the app actually reads should be listed here.
// If it's missing or malformed, Nest refuses to boot instead of failing
// later at a random runtime call site (e.g. jwtService.sign() with an undefined secret).
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),

  PORT: Joi.number().port().default(3000),

  // --- Database ---
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),

  // --- Redis ---
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  // --- Auth / JWT ---
  // Secrets must be long and DIFFERENT from each other — if access and refresh
  // share a secret, a leaked access token could be replayed as a refresh token.
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // --- Cookies ---
  COOKIE_SECURE: Joi.boolean().default(true),

  // --- CORS (Phase 7, but declared here so config is centralized) ---
  CORS_ORIGIN: Joi.string().default('http://localhost:4200'), // Angular CLI dev server
// --- SMTP (Phase 10 - notifications) ---
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().port().default(587),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_FROM: Joi.string().email().default('no-reply@ecommerce.local'),
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SECRET_KEY: Joi.string().required(),
})
  .custom((value, helpers) => {
    if (value.JWT_ACCESS_SECRET === value.JWT_REFRESH_SECRET) {
      return helpers.error('any.invalid', {
        message: 'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different',
      });
    }
    return value;
  })
  .unknown(true); // allow other process.env vars (PATH, npm_*, etc.) to pass through

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT ?? '3000', 10),
  isProduction: process.env.NODE_ENV === 'production',
}));

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
}));

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
}));

export const authConfig = registerAs('auth', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  cookieSecure: process.env.COOKIE_SECURE !== 'false',
}));

export const corsConfig = registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
}));
