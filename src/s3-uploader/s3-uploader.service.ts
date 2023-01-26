import { Injectable } from '@nestjs/common';
import { Message } from 'amqplib';
import { rmSync } from 'fs';
import { SendImageToS3Command } from 'src/dtos';
import { Queue } from 'src/infra/rabbit-connector/queue';
import { RabbitConnectorService } from 'src/infra/rabbit-connector/rabbit-connector.service';
import { S3Service } from 'src/infra/s3/s3.service';

@Injectable()
export class S3UploaderService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly rabbitmqConnector: RabbitConnectorService,
  ) {
    this.bindListener();
  }

  private async upload({ imageName }: SendImageToS3Command) {
    await this.s3Service.uploadFile(imageName);
    rmSync(`./files/${imageName}`);
  }
  private bindListener() {
    const cb = async (msg: Message) => {
      const event = JSON.parse(msg.content.toString()) as SendImageToS3Command;
      await this.upload(event);
    };

    this.rabbitmqConnector.bindListener(Queue.SEND_IMAGE_TO_S3_QUEUE, cb);
  }
}
