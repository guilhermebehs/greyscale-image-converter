import { Inject, Injectable } from '@nestjs/common';
import { CloudAdapter } from '@infra/cloud-adapter/cloud-adapter.service';
import { Message } from 'amqplib';
import { rmSync } from 'fs';
import { UploadImageCommand } from 'src/dtos';
import { Queue } from '@infra/rabbit-connector/queue';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';

@Injectable()
export class UploaderService {
  constructor(
    @Inject('QueueConnector')
    private readonly queueConnector: QueueConnector,
    private readonly cloudAdapter: CloudAdapter,
  ) {
    this.bindListener();
  }

  async upload({ imageName }: UploadImageCommand) {
    await this.cloudAdapter.uploadFile(imageName);
    rmSync(`./files/${imageName}`);
  }
  private bindListener() {
    const cb = async (msg: Message) => {
      const command = JSON.parse(msg.content.toString()) as UploadImageCommand;
      await this.upload(command);
    };

    this.queueConnector.bindListener(Queue.UPLOAD_IMAGE_QUEUE, cb);
  }
}
