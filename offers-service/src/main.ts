import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GeneralExceptionFilter } from './exception-filters/generalException.filter';

import { OffersModule } from './offers.module';
import tracer from 'dd-trace';

tracer.init({
  logInjection: true,
});

async function bootstrap() {
  const app = await NestFactory.create(OffersModule);
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('The Description of your API')
    .setVersion('1.0')
    .build();
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new GeneralExceptionFilter(httpAdapter), // Most General Exception Filter MUST be first
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  process.on('unhandledRejection', (err) => {
    Logger.error(
      'Offers Service Unhandled Rejection(Likely due to asynchronous promise rejection): ',
    );
    Logger.error((err as Error).stack);
  });
}
bootstrap();
