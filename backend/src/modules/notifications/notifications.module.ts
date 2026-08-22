import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsQueue } from './queues/notifications.queue';
import { EmailProcessor } from './processors/email.processor';
import { InvoiceProcessor } from './processors/invoice.processor';
import { PasswordResetProcessor } from './processors/password-reset.processor';
import { EmailVerificationProcessor } from './processors/email-verification.processor';
import { OrderCancelledProcessor } from './processors/order-cancelled.processor';
import { NewsletterProcessor } from './processors/newsletter.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'invoices' },
      { name: 'emails' },
      { name: 'password-reset' },
      { name: 'email-verification' },
      { name: 'order-cancelled' },
      { name: 'newsletter' },
    ),
  ],
  providers: [
    NotificationsQueue,
    InvoiceProcessor,
    EmailProcessor,
    PasswordResetProcessor,
    EmailVerificationProcessor,
    OrderCancelledProcessor,
    NewsletterProcessor,
  ],
  exports: [NotificationsQueue],
})
export class NotificationsModule {}
