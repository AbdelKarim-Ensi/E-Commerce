import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException, ThrottlerLimitDetail } from '@nestjs/throttler';


@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: any,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const response = context.switchToHttp().getResponse();

    // ttl est en millisecondes, Retry-After doit être en secondes
    const retryAfterSeconds = Math.ceil(throttlerLimitDetail.ttl / 1000);
    response.setHeader('Retry-After', retryAfterSeconds.toString());

    throw new ThrottlerException();
  }
}