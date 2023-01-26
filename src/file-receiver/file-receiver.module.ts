import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { FileReceiverController } from './file-receiver.controller';
import { NotifyImageReceivedService } from './notify-image-received.service';

@Module({
  imports: [InfraModule],
  controllers: [FileReceiverController],
  providers: [NotifyImageReceivedService],
})
export class FileReceiverModule {}
