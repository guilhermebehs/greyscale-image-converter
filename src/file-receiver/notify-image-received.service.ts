import { Injectable } from '@nestjs/common';
import { RabbitConnectorService } from 'src/infra/rabbit-connector/rabbit-connector.service';
import { ImageReceivedEvent } from '../dtos/ImageReceivedEvent';

@Injectable()
export class NotifyImageReceivedService {
  constructor(private readonly rabbitMqConnector: RabbitConnectorService) {}

  async notify(imageName: string) {
    const imageReceivedEvent: ImageReceivedEvent = {
      imageName,
      ocurredAt: new Date(),
    };

    await this.rabbitMqConnector.notifyImageReceived(imageReceivedEvent);
  }
}
