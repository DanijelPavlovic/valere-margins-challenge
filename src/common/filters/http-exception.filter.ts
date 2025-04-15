import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  message: string;
  errors?: unknown[];
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ErrorResponse;

    // Validation errors
    if (
      typeof exceptionResponse === 'object' &&
      'errors' in exceptionResponse
    ) {
      return response.status(status).json({
        statusCode: status,
        message: exceptionResponse.message,
        errors: exceptionResponse.errors,
      });
    }

    // Other errors
    response.status(status).json({
      statusCode: status,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || 'Internal server error',
    });
  }
}
