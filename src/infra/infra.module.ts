import { Module } from '@nestjs/common';
import { CloudAdapter } from './cloud-adapter/cloud-adapter.service';
import { ImageEditorAdapter } from './image-editor-adapter/image-editor-adapter.service';
import { RabbitConnector } from './rabbit-connector/rabbit-connector.service';

@Module({
  providers: [
    {
      provide: RabbitConnector,
      useFactory: async () => {
        const rabbitMq = new RabbitConnector();
        await rabbitMq.connect();
        return rabbitMq;
      },
    },
    CloudAdapter,
    ImageEditorAdapter,
  ],
  exports: [RabbitConnector, CloudAdapter, ImageEditorAdapter],
})
export class InfraModule {}
