import { Injectable } from '@nestjs/common';
import { Message } from 'amqplib';
import { Queue } from '@infra/rabbit-connector/queue';
import { ImageReceivedEvent } from 'src/dtos';
import { RabbitConnector } from '@infra/rabbit-connector/rabbit-connector.service';
import { ImageEditorAdapter } from '@src/infra/image-editor-adapter/image-editor-adapter.service';

@Injectable()
export class GreyscaleConverterService {
  constructor(
    private readonly rabbitmqConnector: RabbitConnector,
    private readonly imageEditorAdapter: ImageEditorAdapter,
  ) {
    this.bindListener();
  }

  async convert({ imageName }: ImageReceivedEvent) {
    await this.imageEditorAdapter.greyscale(`./files/${imageName}`);
    await this.rabbitmqConnector.notifyUploadImage({
      imageName,
      ocurredAt: new Date(),
    });
  }

  private bindListener() {
    const cb = async (msg: Message) => {
      const event = JSON.parse(msg.content.toString()) as ImageReceivedEvent;
      await this.convert(event);
    };

    this.rabbitmqConnector.bindListener(Queue.IMAGE_RECEIVED_QUEUE, cb);
  }
}
