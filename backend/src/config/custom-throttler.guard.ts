import { Injectable } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerException,
  ThrottlerLimitDetail,
} from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const response = context.switchToHttp().getResponse<Response>();

    const retryAfterSeconds = Math.ceil(throttlerLimitDetail.ttl / 1000);
    response.setHeader('Retry-After', retryAfterSeconds.toString());

    throw new ThrottlerException();
  }
}
