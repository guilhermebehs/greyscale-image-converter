import { Module } from '@nestjs/common';
import { RemoteStorageAdapter } from './remote-storage-adapter/remote-storage-adapter.service';
import { ImageEditorAdapter } from './image-editor-adapter/image-editor-adapter.service';
import { QueueConnector } from './interfaces/queue-connector';
import { RabbitConnector } from './rabbit-connector/rabbit-connector.service';
import { SQSConnector } from './sqs-connector/sqs-connector.service';

@Module({
  providers: [
    {
      provide: 'QueueConnector',
      useFactory: async () => {
        let queueConnector: QueueConnector;
        if (process.env.NODE_ENV === 'production')
          queueConnector = new SQSConnector();
        else queueConnector = new RabbitConnector();

        await queueConnector.configure();
        return queueConnector;
      },
    },
    RemoteStorageAdapter,
    ImageEditorAdapter,
  ],
  exports: ['QueueConnector', RemoteStorageAdapter, ImageEditorAdapter],
})
export class InfraModule {}
