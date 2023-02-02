import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from '@src/infra/enums/queue';
import { ImageReceivedEvent } from 'src/dtos';
import { ImageEditorAdapter } from '@src/infra/image-editor-adapter/image-editor-adapter.service';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';

@Injectable()
export class GreyscaleConverterService {
  private readonly logger = new Logger(GreyscaleConverterService.name);

  constructor(
    @Inject('QueueConnector')
    private readonly queueConnector: QueueConnector,
    private readonly imageEditorAdapter: ImageEditorAdapter,
  ) {
    this.bindListener();
  }

  async convert(imageReceivedEvent: ImageReceivedEvent) {
    try {
      const { imageName } = imageReceivedEvent;
      this.logger.log(
        `(convert) Message received: ${JSON.stringify(imageReceivedEvent)}`,
      );
      await this.imageEditorAdapter.greyscale(`./files/${imageName}`);

      const uploadImageCommand = {
        imageName,
        ocurredAt: new Date(),
      };
      await this.queueConnector.notifyUploadImage(uploadImageCommand);
      this.logger.log(
        `(convert) Message sent: ${JSON.stringify(uploadImageCommand)}`,
      );
    } catch (e) {
      this.logger.error(
        `(convert) Error handling message ${JSON.stringify(
          imageReceivedEvent,
        )} : ${e.message}`,
      );
    }
  }

  private bindListener() {
    const cb = async (msg: string) => {
      const event = JSON.parse(msg) as ImageReceivedEvent;
      await this.convert(event);
    };

    this.queueConnector.bindListener(Queue.IMAGE_RECEIVED_QUEUE, cb);
  }
}
