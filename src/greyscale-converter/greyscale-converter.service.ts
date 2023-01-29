import { Inject, Injectable } from '@nestjs/common';
import { Message } from 'amqplib';
import { Queue } from '@infra/rabbit-connector/queue';
import { ImageReceivedEvent } from 'src/dtos';
import { RabbitConnector } from '@infra/rabbit-connector/rabbit-connector.service';
import { ImageEditorAdapter } from '@src/infra/image-editor-adapter/image-editor-adapter.service';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';

@Injectable()
export class GreyscaleConverterService {
  constructor(
    @Inject('QueueConnector')
    private readonly queueConnector: QueueConnector,
    private readonly imageEditorAdapter: ImageEditorAdapter,
  ) {
    this.bindListener();
  }

  async convert({ imageName }: ImageReceivedEvent) {
    await this.imageEditorAdapter.greyscale(`./files/${imageName}`);
    await this.queueConnector.notifyUploadImage({
      imageName,
      ocurredAt: new Date(),
    });
  }

  private bindListener() {
    const cb = async (msg: Message) => {
      const event = JSON.parse(msg.content.toString()) as ImageReceivedEvent;
      await this.convert(event);
    };

    this.queueConnector.bindListener(Queue.IMAGE_RECEIVED_QUEUE, cb);
  }
}
