import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestsModule } from './requests.module';
import { GeneralExceptionFilter } from './exception-filters/generalException.filter';
import { TypeORMExceptionFilter } from './exception-filters/typeOrmException.filter';
import tracer from 'dd-trace';

tracer.init({
  logInjection: true,
});

async function bootstrap() {
  const app = await NestFactory.create(RequestsModule);

  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('The Description of your API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        type: 'http',
        in: 'Header',
      },
      'jwt-access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  app.useGlobalPipes(new ValidationPipe());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new GeneralExceptionFilter(httpAdapter), // Most General Exception Filter MUST be first
    new TypeORMExceptionFilter(),
  );

  const configService = app.get<ConfigService>(ConfigService);
  const port: number = configService.get<number>('SERVER_PORT');

  await app.listen(port);
  Logger.log('Requests Service Application Running on Port: ' + port);
  process.on('unhandledRejection', (err) => {
    Logger.error(
      'Requests Service Unhandled Rejection(Likely due to asynchronous promise rejection): ',
    );
    Logger.error((err as Error).stack);
  });
}
bootstrap();
