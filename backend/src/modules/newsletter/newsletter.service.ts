import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsQueue } from '../notifications/queues/notifications.queue';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsQueue: NotificationsQueue,
  ) {}

  async subscribe(email: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return { subscribed: true, alreadySubscribed: true };
      }
      await this.prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true },
      });
      await this.sendWelcomeEmail(email);
      return { subscribed: true, alreadySubscribed: false };
    }

    await this.prisma.newsletterSubscriber.create({ data: { email } });
    await this.sendWelcomeEmail(email);
    return { subscribed: true, alreadySubscribed: false };
  }

  private async sendWelcomeEmail(email: string) {
    try {
      await this.notificationsQueue.enqueueNewsletterEmail(
        email,
        'Bienvenue chez TechGear !',
        'Merci de vous être inscrit à notre newsletter. Vous recevrez désormais nos meilleures offres et actualités tech en avant-première.',
        undefined,
        undefined,
      );
    } catch (error) {
      // On log l'échec sans bloquer l'inscription : l'abonné est déjà enregistré
      // en base, un souci d'envoi d'email ne doit pas faire échouer la requête.
      this.logger.error(
        `Échec de l'envoi de l'email de bienvenue à ${email}: ${(error as Error).message}`,
      );
    }
  }

  async unsubscribe(email: string) {
    await this.prisma.newsletterSubscriber.updateMany({
      where: { email },
      data: { isActive: false },
    });
    return { unsubscribed: true };
  }

  async broadcast(
    subject: string,
    message: string,
    ctaLink?: string,
    ctaText?: string,
  ) {
    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true },
    });

    for (const sub of subscribers) {
      await this.notificationsQueue.enqueueNewsletterEmail(
        sub.email,
        subject,
        message,
        ctaLink,
        ctaText,
      );
    }

    this.logger.log(
      `Newsletter "${subject}" enfilée pour ${subscribers.length} abonné(s)`,
    );

    return { queued: subscribers.length };
  }
}