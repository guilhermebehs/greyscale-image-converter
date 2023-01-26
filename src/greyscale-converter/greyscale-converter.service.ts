import { Injectable } from '@nestjs/common';
import Jimp from 'jimp';
import { Message } from 'amqplib';
import { RabbitConnectorService } from 'src/infra/rabbit-connector/rabbit-connector.service';
import { Queue } from 'src/infra/rabbit-connector/queue';
import { ImageReceivedEvent } from 'src/dtos';

@Injectable()
export class GreyscaleConverterService {
  constructor(private readonly rabbitmqConnector: RabbitConnectorService) {
    this.bindListener();
  }

  async convert({ imageName }: ImageReceivedEvent) {
    Jimp.read('./files/' + imageName, (err, imageRead) => {
      imageRead.greyscale().write('./files/' + imageName);
    });
    await this.rabbitmqConnector.notifySendImageToS3({
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
