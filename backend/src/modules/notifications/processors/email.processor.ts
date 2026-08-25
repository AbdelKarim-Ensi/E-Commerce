import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { PrismaService } from '../../../prisma/prisma.service';
import { renderOrderConfirmationEmail } from '../templates/order-confirmation.template';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  private readonly apiKey: string;
  private readonly fromAddress: string;
  private readonly fromName: string;
  private static readonly BREVO_API_URL =
    'https://api.brevo.com/v3/smtp/email';

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    super();
    this.apiKey = this.config.get<string>('BREVO_API_KEY') ?? '';
    this.fromAddress =
      this.config.get<string>('SMTP_FROM') ?? 'no-reply@ecommerce.local';
    this.fromName = this.config.get<string>('BREVO_SENDER_NAME') ?? 'TechGear';

    if (!this.apiKey && this.config.get<string>('NODE_ENV') !== 'test') {
      this.logger.error(
        'BREVO_API_KEY manquante : les emails de confirmation de commande ne pourront pas être envoyés',
      );
    }
  }

  async process(
    job: Job<{ orderId: string; invoicePath: string }>,
  ): Promise<void> {
    const { orderId, invoicePath } = job.data;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, user: true },
    });

    if (!order) {
      this.logger.error(`Commande ${orderId} introuvable, email annulé`);
      return;
    }

    const { subject, html } = renderOrderConfirmationEmail({
      customerName:
        [order.user.firstName, order.user.lastName].filter(Boolean).join(' ') ||
        order.user.email,
      orderId: order.id,
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toNumber(),
      })),
      totalAmount: order.totalAmount.toNumber(),
    });

    // Brevo API attend les pièces jointes encodées en base64 (pas un chemin fichier)
    const attachment = fs.existsSync(invoicePath)
      ? [
          {
            name: `facture-${orderId}.pdf`,
            content: fs.readFileSync(invoicePath).toString('base64'),
          },
        ]
      : undefined;

    try {
      const response = await fetch(EmailProcessor.BREVO_API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          sender: { email: this.fromAddress, name: this.fromName },
          to: [{ email: order.user.email }],
          subject,
          htmlContent: html,
          ...(attachment ? { attachment } : {}),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Brevo API a répondu ${response.status}: ${errorBody}`,
        );
      }

      this.logger.log(
        `Email envoyé à ${order.user.email} pour la commande ${orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Échec de l'envoi de l'email de confirmation à ${order.user.email}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<{ orderId: string; invoicePath: string }>, error: Error) {
    this.logger.error(
      `Job 'send-email' échoué pour la commande ${job.data?.orderId}: ${error.message}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<{ orderId: string; invoicePath: string }>) {
    this.logger.log(
      `Job 'send-email' complété pour la commande ${job.data?.orderId}`,
    );
  }
}