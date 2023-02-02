import { Module } from '@nestjs/common';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { InfraModule } from 'src/infra/infra.module';
import { FileReceiverController } from './file-receiver.controller';
import { NotifyImageReceivedService } from './notify-image-received.service';

@Module({
  imports: [InfraModule],
  controllers: [FileReceiverController],
  providers: [
    NotifyImageReceivedService,
    makeCounterProvider({
      name: 'file_received_success',
      help: 'number of files correctly stored and notified',
    }),
    makeCounterProvider({
      name: 'file_received_failure',
      help: 'number of files that could not be stored or notified',
    }),
  ],
})
export class FileReceiverModule {}
