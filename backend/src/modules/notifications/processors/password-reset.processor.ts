import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { renderPasswordResetEmail } from '../templates/password-reset.template';

export interface PasswordResetJobData {
  email: string;
  resetLink: string;
  expiresInMinutes: number;
}

@Processor('password-reset')
export class PasswordResetProcessor extends WorkerHost {
  private readonly logger = new Logger(PasswordResetProcessor.name);
  private readonly apiKey: string;
  private readonly fromAddress: string;
  private readonly fromName: string;
  private static readonly BREVO_API_URL =
    'https://api.brevo.com/v3/smtp/email';

  constructor(private readonly config: ConfigService) {
    super();
    this.apiKey = this.config.get<string>('BREVO_API_KEY') ?? '';
    this.fromAddress =
      this.config.get<string>('SMTP_FROM') ?? 'no-reply@ecommerce.local';
    this.fromName = this.config.get<string>('BREVO_SENDER_NAME') ?? 'TechGear';

    if (!this.apiKey && this.config.get<string>('NODE_ENV') !== 'test') {
      this.logger.error(
        'BREVO_API_KEY manquante : les emails de réinitialisation ne pourront pas être envoyés',
      );
    }
  }

  async process(job: Job<PasswordResetJobData>): Promise<void> {
    const { email, resetLink, expiresInMinutes } = job.data;

    const { subject, html } = renderPasswordResetEmail({
      resetLink,
      expiresInMinutes,
    });

    try {
      const response = await fetch(PasswordResetProcessor.BREVO_API_URL, {
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

      this.logger.log(`Email de réinitialisation envoyé à ${email}`);
    } catch (error) {
      this.logger.error(
        `Échec de l'envoi de l'email de réinitialisation à ${email}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<PasswordResetJobData>, error: Error) {
    this.logger.error(
      `Job 'send-password-reset' échoué pour ${job.data?.email}: ${error.message}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<PasswordResetJobData>) {
    this.logger.log(
      `Job 'send-password-reset' complété pour ${job.data?.email}`,
    );
  }
}