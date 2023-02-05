import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@src/filters/http-exception-filter';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { InfraModule } from 'src/infra/infra.module';
import { FileReceiverController } from './file-receiver.controller';
import { NotifyImageReceivedService } from './notify-image-received.service';

@Module({
  imports: [InfraModule],
  controllers: [FileReceiverController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    NotifyImageReceivedService,
    makeCounterProvider({
      name: 'file_received_success',
      help: 'number of files correctly stored and notified',
    }),
    makeCounterProvider({
      name: 'file_received_failure',
      help: 'number of files that could not be stored or notified',
    }),
    makeCounterProvider({
      name: 'http_errors',
      help: 'number of http errors',
      labelNames: ['status'],
    }),
  ],
})
export class FileReceiverModule {}
