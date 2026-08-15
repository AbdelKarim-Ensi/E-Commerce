import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
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
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;
  private readonly apiUrl: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.fromAddress = this.config.get<string>('SMTP_FROM') ?? 'no-reply@ecommerce.local';
    this.apiUrl = this.config.get<string>('API_URL') ?? 'http://localhost:3000';
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

    await this.transporter.sendMail({
      from: this.fromAddress,
      to: email,
      subject,
      html,
    });

    this.logger.log(`Newsletter envoyée à ${email}`);
  }
}