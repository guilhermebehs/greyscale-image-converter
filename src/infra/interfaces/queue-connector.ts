import { ImageReceivedEvent, UploadImageCommand } from '@src/dtos';
import { Queue } from '../enums/queue';

export interface QueueConnector {
  configure(): Promise<void>;

  notifyImageReceived(imageReceived: ImageReceivedEvent): Promise<void>;

  notifyUploadImage(uploadImage: UploadImageCommand): Promise<void>;

  bindListener(queueName: Queue, cb: any): Promise<void>;
}
