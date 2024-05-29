import {
  INestApplication,
  Logger,
  ValidationPipe,
  ValidationPipeOptions,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "@/app.module";

const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  stopAtFirstError: true,
};

async function bootstrap() {
  const logger: Logger = new Logger("main");

  const app: INestApplication<any> = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  const configService: ConfigService<unknown, boolean> = app.get(ConfigService);

  const PORT: number = configService.get<number>("PORT");
  const ENV: string = configService.get<string>("NODE_ENV");
  await app.listen(PORT);

  logger.verbose(`\nENV: ${ENV}\nPORT: ${PORT}\nURL: ${await app.getUrl()}\n`);
}

bootstrap();
