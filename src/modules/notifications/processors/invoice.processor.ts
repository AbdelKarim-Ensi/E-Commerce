import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

const INVOICES_DIR = path.join(process.cwd(), 'storage', 'invoices');

@Processor('invoices')
export class InvoiceProcessor extends WorkerHost {
  private readonly logger = new Logger(InvoiceProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('emails') private readonly emailsQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<{ orderId: string }>): Promise<void> {
    const { orderId } = job.data;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, user: true },
    });

    if (!order) {
      this.logger.error(`Commande ${orderId} introuvable, facture annulée`);
      return;
    }

    if (!fs.existsSync(INVOICES_DIR)) {
      fs.mkdirSync(INVOICES_DIR, { recursive: true });
    }

    const invoicePath = path.join(INVOICES_DIR, `${orderId}.pdf`);
    await this.generatePdf(order, invoicePath);
    this.logger.log(`Facture générée: ${invoicePath}`);

    await this.emailsQueue.add(
      'send-order-confirmation',
      { orderId, invoicePath },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }

  private generatePdf(
    order: {
      id: string;
      totalAmount: { toNumber: () => number };
      createdAt: Date;
      user: { firstName: string | null; lastName: string | null; email: string };
      items: { quantity: number; unitPrice: { toNumber: () => number }; product: { name: string } }[];
    },
    outputPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      doc.fontSize(20).text('Facture', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Commande #${order.id}`);
      doc.text(`Date : ${order.createdAt.toLocaleDateString('fr-FR')}`);
      doc.text(
        `Client : ${[order.user.firstName, order.user.lastName].filter(Boolean).join(' ') || order.user.email}`,
      );
      doc.moveDown();

      doc.fontSize(12).text('Détail de la commande', { underline: true });
      doc.moveDown(0.5);

      order.items.forEach((item) => {
        const lineTotal = item.unitPrice.toNumber() * item.quantity;
        doc
          .fontSize(10)
          .text(
            `${item.product.name}  x${item.quantity}  —  ${item.unitPrice.toNumber().toFixed(2)} €  =  ${lineTotal.toFixed(2)} €`,
          );
      });

      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Total : ${order.totalAmount.toNumber().toFixed(2)} €`, { align: 'right' });

      doc.end();
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });
  }
}