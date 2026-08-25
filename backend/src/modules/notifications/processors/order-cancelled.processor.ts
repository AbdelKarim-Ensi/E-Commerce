import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { renderOrderCancelledEmail } from '../templates/order-cancelled.template';

export interface OrderCancelledJobData {
  email: string;
  orderId: string;
  totalAmount: number;
  refunded: boolean;
}

@Processor('order-cancelled')
export class OrderCancelledProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderCancelledProcessor.name);
  private readonly apiKey: string;
  private readonly fromAddress: string;
  private readonly fromName: string;
  private static readonly BREVO_API_URL =
    'https://api.brevo.com/v3/smtp/email';

  constructor(private readonly config: ConfigService) {
    super();
    this.apiKey = this.config.get<string>('BREVO_API_KEY') ?? '';
    this.fromAddress =
      this.config.get<string>('SMTP_FROM') ?? 'no-reply@ecommerce.local';
    this.fromName = this.config.get<string>('BREVO_SENDER_NAME') ?? 'TechGear';

    if (!this.apiKey && this.config.get<string>('NODE_ENV') !== 'test') {
      this.logger.error(
        'BREVO_API_KEY manquante : les emails d\'annulation ne pourront pas être envoyés',
      );
    }
  }

  async process(job: Job<OrderCancelledJobData>): Promise<void> {
    const { email, orderId, totalAmount, refunded } = job.data;

    const { subject, html } = renderOrderCancelledEmail({
      orderId,
      totalAmount,
      refunded,
    });

    try {
      const response = await fetch(OrderCancelledProcessor.BREVO_API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          sender: { email: this.fromAddress, name: this.fromName },
          to: [{ email }],
          subject,
          htmlContent: html,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Brevo API a répondu ${response.status}: ${errorBody}`,
        );
      }

      this.logger.log(
        `Email d'annulation envoyé à ${email} pour la commande ${orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Échec de l'envoi de l'email d'annulation à ${email}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<OrderCancelledJobData>, error: Error) {
    this.logger.error(
      `Job 'send-order-cancelled' échoué pour ${job.data?.email}: ${error.message}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<OrderCancelledJobData>) {
    this.logger.log(
      `Job 'send-order-cancelled' complété pour ${job.data?.email}`,
    );
  }
}