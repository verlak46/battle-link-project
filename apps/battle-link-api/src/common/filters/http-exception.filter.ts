import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!(exception instanceof HttpException)) {
      console.error('[Unhandled Exception]', exception);
    }

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as { message?: string | string[] })?.message ?? exception.message
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      error: Array.isArray(message) ? message.join(', ') : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
