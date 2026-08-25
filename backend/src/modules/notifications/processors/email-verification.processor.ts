import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { renderEmailVerificationEmail } from '../templates/email-verification.template';

export interface EmailVerificationJobData {
  email: string;
  verifyLink: string;
}

@Processor('email-verification')
export class EmailVerificationProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailVerificationProcessor.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private readonly config: ConfigService) {
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

    // Vérifie la connexion SMTP au démarrage du worker pour détecter
    // immédiatement un problème de credentials/host/port, plutôt que
    // d'échouer silencieusement au premier job traité.
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error(
          `Échec de vérification de la connexion SMTP: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.log('Connexion SMTP vérifiée avec succès');
      }
    });
  }

  async process(job: Job<EmailVerificationJobData>): Promise<void> {
    const { email, verifyLink } = job.data;

    const { subject, html } = renderEmailVerificationEmail({ verifyLink });

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: email,
        subject,
        html,
      });

      this.logger.log(`Email de vérification envoyé à ${email}`);
    } catch (error) {
      this.logger.error(
        `Échec de l'envoi de l'email de vérification à ${email}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      // On relance l'erreur pour que BullMQ marque le job comme failed
      // (retry automatique selon la config de la queue), plutôt que de
      // l'avaler silencieusement.
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<EmailVerificationJobData>, error: Error) {
    this.logger.error(
      `Job 'send-email-verification' échoué pour ${job.data?.email}: ${error.message}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<EmailVerificationJobData>) {
    this.logger.log(
      `Job 'send-email-verification' complété pour ${job.data?.email}`,
    );
  }
}