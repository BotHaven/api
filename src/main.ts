import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from "morgan";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan("tiny")); // needs interceptor if injected from "nestjs-morgan"

  await app.listen(3000);
}
bootstrap();
