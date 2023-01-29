import { ImageReceivedEvent, UploadImageCommand } from '@src/dtos';
import { Queue } from '../rabbit-connector/queue';

export interface QueueConnector {
  connect(): Promise<any>;

  notifyImageReceived(imageReceived: ImageReceivedEvent): Promise<any>;

  notifyUploadImage(uploadImage: UploadImageCommand): Promise<any>;

  bindListener(queueName: Queue, cb: any): Promise<any>;
}
