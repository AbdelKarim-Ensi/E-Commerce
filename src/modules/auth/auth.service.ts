import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RedisService } from '../../redis/redis.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 12;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; 

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
  ) {}

  private sanitizeUser(user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  }) {
    const { id, email, firstName, lastName, role } = user;
    return { id, email, firstName, lastName, role };
  }

  private redisKey(userId: string, jti: string) {
    return `refresh:${userId}:${jti}`;
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
     
    }
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