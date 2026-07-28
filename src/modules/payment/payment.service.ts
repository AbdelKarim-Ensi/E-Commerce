import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { NotificationsQueue } from '../notifications/queues/notifications.queue';
@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly notificationsQueue: NotificationsQueue,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      { apiVersion: '2026-06-24.dahlia' },
    );
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!;
  }
  

  async createPaymentIntent(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    if (order.userId !== userId) {
      throw new BadRequestException("Cette commande ne vous appartient pas");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Impossible de payer une commande au statut ${order.status}`,
      );
    }

    const amountInCents = Math.round(order.totalAmount.toNumber() * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async handleWebhookEvent(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;

    // 1. Vérification cryptographique de la signature — LA étape de sécurité critique.
    // Empêche quiconque d'appeler ce endpoint en forgeant un faux événement.
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.warn(`Signature webhook invalide: ${(err as Error).message}`);
      throw new BadRequestException('Signature webhook invalide');
    }

    // 2. Idempotence — Stripe peut renvoyer le même événement plusieurs fois
    // (retries réseau, etc.). On ne traite chaque event.id qu'une seule fois.
    // Some projects may not have a Prisma model for processed webhook events.
    // Guard access to prisma.processedWebhookEvent to avoid runtime TS/JS errors.
    const prismaAny = this.prisma as any;
    if (prismaAny.processedWebhookEvent && typeof prismaAny.processedWebhookEvent.findUnique === 'function') {
      const alreadyProcessed = await prismaAny.processedWebhookEvent.findUnique({
        where: { id: event.id },
      });

      if (alreadyProcessed) {
        this.logger.log(`Événement ${event.id} déjà traité, ignoré (idempotence)`);
        return { received: true, duplicate: true };
      }
    } else {
      this.logger.warn('No Prisma model processedWebhookEvent found — skipping persistent idempotence check');
    }

    // 3. Traitement selon le type d'événement
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        this.logger.log(`Événement non géré: ${event.type}`);
    }

    // 4. On enregistre l'event comme traité SEULEMENT après succès du traitement
    if (prismaAny.processedWebhookEvent && typeof prismaAny.processedWebhookEvent.create === 'function') {
      await prismaAny.processedWebhookEvent.create({
        data: { id: event.id, eventType: event.type },
      });
    } else {
      this.logger.warn('No Prisma model processedWebhookEvent found — skipping persistent event recording');
    }

    return { received: true };
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      this.logger.error(
        `PaymentIntent ${paymentIntent.id} sans orderId dans metadata`,
      );
      return;
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      this.logger.error(`Commande ${orderId} introuvable pour webhook`);
      return;
    }

    // On ne transite QUE si la commande est encore PENDING —
    // évite d'écraser un état déjà avancé (ex: déjà SHIPPED via un autre flux).
    if (order.status !== OrderStatus.PENDING) {
      this.logger.warn(
        `Commande ${orderId} déjà au statut ${order.status}, webhook ignoré`,
      );
      return;
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
    });
    this.logger.log(`Commande ${orderId} marquée PAID`);
await this.notificationsQueue.enqueueOrderConfirmation(orderId)

    
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) return;

    this.logger.warn(`Paiement échoué pour la commande ${orderId}`);
    // Optionnel : notifier l'utilisateur, ou laisser la commande en PENDING
    // pour permettre une nouvelle tentative de paiement.
  }
}