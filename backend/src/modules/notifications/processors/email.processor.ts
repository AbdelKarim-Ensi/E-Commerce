import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { PrismaService } from '../../../prisma/prisma.service';
import { renderOrderConfirmationEmail } from '../templates/order-confirmation.template';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    super();
    this.fromAddress =
      this.config.get<string>('SMTP_FROM') ?? 'no-reply@ecommerce.local';
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

    const attachments = fs.existsSync(invoicePath)
      ? [{ filename: `facture-${orderId}.pdf`, path: invoicePath }]
      : [];

    await this.transporter.sendMail({
      from: this.fromAddress,
      to: order.user.email,
      subject,
      html,
      attachments,
    });

    this.logger.log(
      `Email envoyé à ${order.user.email} pour la commande ${orderId}`,
    );
  }
}
