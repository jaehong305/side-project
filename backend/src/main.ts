import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { QueryErrorFilter } from './common/filter/query-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter(), new QueryErrorFilter());
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
