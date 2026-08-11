import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis/redis.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsQueue } from '../notifications/queues/notifications.queue';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

const SALT_ROUNDS = 12;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;
const RESET_PASSWORD_TTL_SECONDS = 30 * 60; // 30 minutes
const RESET_PASSWORD_TTL_MINUTES = RESET_PASSWORD_TTL_SECONDS / 60;
const EMAIL_VERIFICATION_TTL_SECONDS = 24 * 60 * 60; // 24 heures

interface RefreshPayload {
  sub: string;
  email: string;
  role: string;
  jti: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redis: RedisService,
    private config: ConfigService,
    private notificationsQueue: NotificationsQueue,
  ) {}

  private sanitizeUser(user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    emailVerified: boolean;
  }) {
    const { id, email, firstName, lastName, role, emailVerified } = user;
    return { id, email, firstName, lastName, role, emailVerified };
  }

  private redisKey(userId: string, jti: string) {
    return `refresh:${userId}:${jti}`;
  }

  private resetPasswordKey(tokenHash: string) {
    return `reset-password:${tokenHash}`;
  }

  private emailVerificationKey(tokenHash: string) {
    return `verify-email:${tokenHash}`;
  }

  private signAccessToken(userId: string, email: string, role: string) {
    return this.jwtService.sign({ sub: userId, email, role }, { expiresIn: '15m' });
  }

  private async issueRefreshToken(userId: string, email: string, role: string) {
    const jti = crypto.randomUUID();
    const refreshToken = this.jwtService.sign(
      { sub: userId, email, role, jti } as RefreshPayload,
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await this.redis.client.set(this.redisKey(userId, jti), tokenHash, 'EX', REFRESH_TTL_SECONDS);

    return refreshToken;
  }

  /**
   * Génère un token de vérification, le stocke en Redis (hashé, TTL 24h) et
   * enfile l'email de vérification. Extrait de register() pour être
   * réutilisable par un futur endpoint "renvoyer l'email de vérification".
   */
  private async sendVerificationEmail(userId: string, email: string) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    await this.redis.client.set(
      this.emailVerificationKey(tokenHash),
      userId,
      'EX',
      EMAIL_VERIFICATION_TTL_SECONDS,
    );

    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:4200';
    const verifyLink = `${frontendUrl}/verify-email?token=${rawToken}`;

    await this.notificationsQueue.enqueueEmailVerification(email, verifyLink);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    // Envoi asynchrone, non bloquant pour l'inscription : si la queue échoue,
    // l'utilisateur reste créé et pourra redemander l'email plus tard.
    await this.sendVerificationEmail(user.id, user.email);

    const accessToken = this.signAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.issueRefreshToken(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.signAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.issueRefreshToken(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    let payload: RefreshPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const key = this.redisKey(payload.sub, payload.jti);
    const storedHash = await this.redis.client.get(key);
    const incomingHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    if (!storedHash || storedHash !== incomingHash) {
      await this.revokeAllForUser(payload.sub);
      throw new UnauthorizedException('Refresh token reuse detected — all sessions revoked');
    }

    await this.redis.client.del(key);

    const accessToken = this.signAccessToken(payload.sub, payload.email, payload.role);
    const newRefreshToken = await this.issueRefreshToken(payload.sub, payload.email, payload.role);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    try {
      const payload: RefreshPayload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      await this.redis.client.del(this.redisKey(payload.sub, payload.jti));
    } catch {
      // token déjà invalide/expiré — rien à révoquer
    }
    return { success: true };
  }

  /**
   * Toujours renvoyer un succès générique, que l'email existe ou non côté
   * base — sinon un attaquant peut énumérer les comptes existants en testant
   * des adresses et en observant la différence de réponse.
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      await this.redis.client.set(
        this.resetPasswordKey(tokenHash),
        user.id,
        'EX',
        RESET_PASSWORD_TTL_SECONDS,
      );

      const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:4200';
      const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

      await this.notificationsQueue.enqueuePasswordReset(
        user.email,
        resetLink,
        RESET_PASSWORD_TTL_MINUTES,
      );
    }

    return {
      success: true,
      message: "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.",
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');
    const key = this.resetPasswordKey(tokenHash);

    const userId = await this.redis.client.get(key);
    if (!userId) {
      throw new BadRequestException('Lien de réinitialisation invalide ou expiré');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Le token à usage unique est consommé.
    await this.redis.client.del(key);

    // Sécurité : un mot de passe compromis justifie une déconnexion globale —
    // toutes les sessions actives (refresh tokens) de cet utilisateur sont révoquées.
    await this.revokeAllForUser(userId);

    return { success: true };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');
    const key = this.emailVerificationKey(tokenHash);

    const userId = await this.redis.client.get(key);
    if (!userId) {
      throw new BadRequestException('Lien de vérification invalide ou expiré');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    // Token à usage unique, consommé après vérification.
    await this.redis.client.del(key);

    return { success: true };
  }

  private async revokeAllForUser(userId: string) {
    const pattern = `refresh:${userId}:*`;
    const keys = await this.redis.client.keys(pattern);
    if (keys.length > 0) {
      await this.redis.client.del(...keys);
    }
  }
}