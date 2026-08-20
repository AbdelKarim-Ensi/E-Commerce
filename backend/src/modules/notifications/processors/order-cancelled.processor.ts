import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
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
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.fromAddress = this.config.get<string>('SMTP_FROM') ?? 'no-reply@ecommerce.local';
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: this.config.get<number>('SMTP_PORT') === 465,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async process(job: Job<OrderCancelledJobData>): Promise<void> {
    const { email, orderId, totalAmount, refunded } = job.data;

    const { subject, html } = renderOrderCancelledEmail({ orderId, totalAmount, refunded });

    await this.transporter.sendMail({
      from: this.fromAddress,
      to: email,
      subject,
      html,
    });

    this.logger.log(`Email d'annulation envoyé à ${email} pour la commande ${orderId}`);
  }
}