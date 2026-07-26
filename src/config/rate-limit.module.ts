import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        // Default global limit: generous, just to stop obvious abuse/scraping
        name: 'default',
        ttl: 60000, // 1 minute window
        limit: 100, // 100 requests / minute / IP
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // applies the 'default' limit to every route automatically
    },
  ],
})
export class RateLimitModule {}