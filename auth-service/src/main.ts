import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth.module';
import { GeneralExceptionFilter } from './exception-filters/generalException.filter';

import { OTPExceptionFilter } from './exception-filters/otpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  //Swagger OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('The Description of you API')
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
    .addBearerAuth(
      {
        description: `Enter Refresh token in following format: Bearer <JWT>`,
        name: 'Authorization',
        type: 'http',
        in: 'Header',
      },
      'jwt-refresh-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  // class-validator Validation setup
  app.useGlobalPipes(new ValidationPipe());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new GeneralExceptionFilter(httpAdapter),
    new OTPExceptionFilter(),
  );

  //Access env vairables using ConfigService
  const configService = app.get<ConfigService>(ConfigService);
  const port: number = configService.get<number>('SERVER_PORT');

  await app.listen(port);
  Logger.log('Auth Service Application Running on Port: ' + port);
  process.on('unhandledRejection', (err) => {
    Logger.error(
      'Auth Service Unhandled Rejection(Likely due to asynchronous promise rejection): ',
    );
    Logger.error((err as Error).stack);
  });
}
bootstrap();
