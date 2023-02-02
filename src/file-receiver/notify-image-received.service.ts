import { Inject, Injectable, Logger } from '@nestjs/common';
import { ImageReceivedEvent } from '../dtos/ImageReceivedEvent';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';

@Injectable()
export class NotifyImageReceivedService {
  private readonly logger = new Logger(NotifyImageReceivedService.name);

  constructor(
    @Inject('QueueConnector')
    private readonly queueConnector: QueueConnector,
  ) {}

  async notify(imageName: string) {
    const imageReceivedEvent: ImageReceivedEvent = {
      imageName,
      ocurredAt: new Date(),
    };

    try {
      await this.queueConnector.notifyImageReceived(imageReceivedEvent);

      this.logger.log(
        `(notify) Message sent: ${JSON.stringify(imageReceivedEvent)}`,
      );
    } catch (e) {
      this.logger.error(
        `(notify) Error sending message ${JSON.stringify(
          imageReceivedEvent,
        )}: ${e.message}`,
      );
    }
  }
}
