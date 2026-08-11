import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsQueue {
  private readonly logger = new Logger(NotificationsQueue.name);

  constructor(
    @InjectQueue('invoices') private readonly invoicesQueue: Queue,
    @InjectQueue('password-reset') private readonly passwordResetQueue: Queue,
    @InjectQueue('email-verification') private readonly emailVerificationQueue: Queue,
  ) {}

  async enqueueOrderConfirmation(orderId: string) {
    await this.invoicesQueue.add(
      'generate-invoice',
      { orderId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
    this.logger.log(`Job 'generate-invoice' enfilé pour la commande ${orderId}`);
  }

  async enqueuePasswordReset(email: string, resetLink: string, expiresInMinutes: number) {
    await this.passwordResetQueue.add(
      'send-password-reset',
      { email, resetLink, expiresInMinutes },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
    this.logger.log(`Job 'send-password-reset' enfilé pour ${email}`);
  }

  async enqueueEmailVerification(email: string, verifyLink: string) {
    await this.emailVerificationQueue.add(
      'send-email-verification',
      { email, verifyLink },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
    this.logger.log(`Job 'send-email-verification' enfilé pour ${email}`);
  }
}