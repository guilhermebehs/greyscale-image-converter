import { NestFactory } from '@nestjs/core';
import { existsSync, promises } from 'fs';
import { AppModule } from './app.module';
import dotenv from 'dotenv';

async function createFileFolder() {
  const path = './files';
  const fileFolderExists = existsSync(path);
  if (!fileFolderExists) await promises.mkdir(path);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await createFileFolder();
  dotenv.config();
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
