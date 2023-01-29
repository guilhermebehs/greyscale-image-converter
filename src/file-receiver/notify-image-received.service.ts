import { Inject, Injectable } from '@nestjs/common';
import { ImageReceivedEvent } from '../dtos/ImageReceivedEvent';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';

@Injectable()
export class NotifyImageReceivedService {
  constructor(
    @Inject('QueueConnector')
    private readonly queueConnector: QueueConnector,
  ) {}

  async notify(imageName: string) {
    const imageReceivedEvent: ImageReceivedEvent = {
      imageName,
      ocurredAt: new Date(),
    };

    await this.queueConnector.notifyImageReceived(imageReceivedEvent);
  }
}
