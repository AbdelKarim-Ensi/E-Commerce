import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { StorageService } from '../../uploads/storage.service';
import PDFDocument from 'pdfkit';

@Processor('invoices')
export class InvoiceProcessor extends WorkerHost {
  private readonly logger = new Logger(InvoiceProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
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

    // Génération du PDF entièrement en mémoire (Buffer) — plus d'écriture
    // sur le filesystem local, qui ne persiste pas sur Render free tier.
    const pdfBuffer = await this.generatePdfBuffer(order);

    // Upload vers Supabase Storage (bucket privé) pour la persistance et
    // permettre un futur téléchargement depuis l'admin ou le compte client.
    await this.storage.uploadInvoice(orderId, pdfBuffer);
    this.logger.log(`Facture uploadée sur Supabase pour la commande ${orderId}`);

    // On passe directement le buffer en base64 au job email : pas besoin de
    // re-télécharger depuis Supabase, on l'a déjà ici.
    await this.emailsQueue.add(
      'send-order-confirmation',
      { orderId, invoiceBase64: pdfBuffer.toString('base64') },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }

  private generatePdfBuffer(order: {
    id: string;
    totalAmount: { toNumber: () => number };
    createdAt: Date;
    user: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
    items: {
      quantity: number;
      unitPrice: { toNumber: () => number };
      product: { name: string };
    }[];
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

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
        .text(`Total : ${order.totalAmount.toNumber().toFixed(2)} €`, {
          align: 'right',
        });

      doc.end();
    });
  }
}