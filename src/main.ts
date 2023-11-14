import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: [ 'http://localhost:3000' ],
    credentials: true,
    exposedHeaders: [ 'Authorization' ]
  });

  await app.listen(process.env.PORT || 3000);
  console.log( `${process.env.PORT} port working!` )
}

bootstrap();
