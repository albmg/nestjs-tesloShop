import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Boostrap')

  // Add API to endpoints
  app.setGlobalPrefix('api');

  
  // Global configuration Pipes
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT);

  logger.log(`App running on port ${ process.env.PORT }`)
}
bootstrap();
