import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsQueue {
  private readonly logger = new Logger(NotificationsQueue.name);

  constructor(@InjectQueue('invoices') private readonly invoicesQueue: Queue) {}

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
}