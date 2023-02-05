import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

import { Request, Response } from 'express';
import { Counter } from 'prom-client';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectMetric('http_errors')
    private readonly httpErrors: Counter<string>,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse() as object;
    if (status === HttpStatus.INTERNAL_SERVER_ERROR)
      message['message'] = undefined;

    this.httpErrors.labels(String(status)).inc();

    response.status(status).json({
      ...message,
      timestamp: new Date().toISOString(),
    });
  }
}
