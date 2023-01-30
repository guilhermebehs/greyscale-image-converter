import { Inject, Injectable } from '@nestjs/common';
import { Queue } from '@src/infra/enums/queue';
import { ImageReceivedEvent } from 'src/dtos';
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
    const cb = async (msg: string) => {
      const event = JSON.parse(msg) as ImageReceivedEvent;
      await this.convert(event);
    };

    this.queueConnector.bindListener(Queue.IMAGE_RECEIVED_QUEUE, cb);
  }
}
