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
      return { subscribed: true, alreadySubscribed: false };
    }

    await this.prisma.newsletterSubscriber.create({ data: { email } });
    return { subscribed: true, alreadySubscribed: false };
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
