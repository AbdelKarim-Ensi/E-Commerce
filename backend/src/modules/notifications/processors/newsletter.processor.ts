import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { renderNewsletterEmail } from '../templates/newsletter.template';

interface NewsletterJobData {
  email: string;
  subject: string;
  message: string;
  ctaLink?: string;
  ctaText?: string;
}

@Processor('newsletter')
export class NewsletterProcessor extends WorkerHost {
  private readonly logger = new Logger(NewsletterProcessor.name);
  private readonly apiKey: string;
  private readonly fromAddress: string;
  private readonly fromName: string;
  private readonly apiUrl: string;
  private static readonly BREVO_API_URL =
    'https://api.brevo.com/v3/smtp/email';

  constructor(private readonly config: ConfigService) {
    super();
    this.apiKey = this.config.get<string>('BREVO_API_KEY') ?? '';
    this.fromAddress =
      this.config.get<string>('SMTP_FROM') ?? 'no-reply@ecommerce.local';
    this.fromName = this.config.get<string>('BREVO_SENDER_NAME') ?? 'TechGear';
    this.apiUrl = this.config.get<string>('API_URL') ?? 'http://localhost:3000';

    if (!this.apiKey && this.config.get<string>('NODE_ENV') !== 'test') {
      this.logger.error(
        'BREVO_API_KEY manquante : les emails de newsletter ne pourront pas être envoyés',
      );
    }
  }

  async process(job: Job<NewsletterJobData>): Promise<void> {
    const { email, subject, message, ctaLink, ctaText } = job.data;

    const unsubscribeLink = `${this.apiUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

    const { html } = renderNewsletterEmail({
      subject,
      message,
      ctaLink,
      ctaText,
      unsubscribeLink,
    });

    try {
      const response = await fetch(NewsletterProcessor.BREVO_API_URL, {
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

      this.logger.log(`Newsletter envoyée à ${email}`);
    } catch (error) {
      this.logger.error(
        `Échec de l'envoi de la newsletter à ${email}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<NewsletterJobData>, error: Error) {
    this.logger.error(
      `Job 'send-newsletter' échoué pour ${job.data?.email}: ${error.message}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<NewsletterJobData>) {
    this.logger.log(`Job 'send-newsletter' complété pour ${job.data?.email}`);
  }
}