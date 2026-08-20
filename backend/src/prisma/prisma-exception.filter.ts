import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, HttpException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

// A05 (Security Misconfiguration) / A09 (Logging) touch point: without this filter,
// unhandled Prisma errors leak raw stack traces and internal field names to the client
// via the default 500 response — useful info for an attacker, and just plain unprofessional.
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const mapped = this.mapPrismaError(exception);
    const status = mapped instanceof HttpException ? mapped.getStatus() : 500;
    const body = mapped instanceof HttpException ? mapped.getResponse() : { message: 'Internal server error' };

    response.status(status).json(body);
  }

  private mapPrismaError(exception: Prisma.PrismaClientKnownRequestError): HttpException | null {
    switch (exception.code) {
      case 'P2002': {
        // Unique constraint violation — e.g. duplicate slug, email, etc.
        const target = (exception.meta?.target as string[] | undefined)?.join(', ') ?? 'field';
        return new ConflictException(`A record with this ${target} already exists`);
      }
      case 'P2025':
        // Record to update/delete was not found
        return new NotFoundException('Record not found');
      case 'P2003':
        // Foreign key constraint failed — e.g. categoryId that doesn't exist
        return new ConflictException('Related record does not exist');
      default:
        return null; // fall through to generic 500 for anything not explicitly mapped
    }
  }
}