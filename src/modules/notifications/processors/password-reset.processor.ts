import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { renderPasswordResetEmail } from '../templates/password-reset.template';

export interface PasswordResetJobData {
  email: string;
  resetLink: string;
  expiresInMinutes: number;
}

@Processor('password-reset')
export class PasswordResetProcessor extends WorkerHost {
  private readonly logger = new Logger(PasswordResetProcessor.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.fromAddress = this.config.get<string>('SMTP_FROM') ?? 'no-reply@ecommerce.local';
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

  async process(job: Job<PasswordResetJobData>): Promise<void> {
    const { email, resetLink, expiresInMinutes } = job.data;

    const { subject, html } = renderPasswordResetEmail({ resetLink, expiresInMinutes });

    await this.transporter.sendMail({
      from: this.fromAddress,
      to: email,
      subject,
      html,
    });

    this.logger.log(`Email de réinitialisation envoyé à ${email}`);
  }
}