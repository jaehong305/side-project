import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.message;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log('===================');
    console.log('에러가 발생했어요!!');
    console.log('에러내용:', message);
    console.log('에러코드:', status);
    console.log('===================');

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      errorMessage: message,
    });
  }
}
