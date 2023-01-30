import { ImageReceivedEvent, UploadImageCommand } from '@src/dtos';
import { QueueConnector } from '../interfaces/queue-connector';
import AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import QueueUrl from './queue-url';
import { Queue } from '../enums/queue';

export class SQSConnector implements QueueConnector {
  private sqs: AWS.SQS;
  private sqsUrls: Map<any, any>;

  async configure(): Promise<void> {
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    this.sqsUrls = QueueUrl();
    console.log('connected to SQS');
  }

  async notifyImageReceived(imageReceived: ImageReceivedEvent): Promise<void> {
    const params = {
      MessageAttributes: {
        'Content-Type': {
          DataType: 'String',
          StringValue: 'application/json',
        },
      },
      MessageBody: JSON.stringify(imageReceived),

      QueueUrl: this.sqsUrls.get(Queue.IMAGE_RECEIVED_QUEUE),
    };

    await this.sqs.sendMessage(params).promise();
  }
  async notifyUploadImage(uploadImage: UploadImageCommand): Promise<void> {
    const params = {
      MessageAttributes: {
        'Content-Type': {
          DataType: 'String',
          StringValue: 'application/json',
        },
      },
      MessageBody: JSON.stringify(uploadImage),

      QueueUrl: this.sqsUrls.get(Queue.UPLOAD_IMAGE_QUEUE),
    };

    await this.sqs.sendMessage(params).promise();
  }
  async bindListener(queueName: Queue, cb: any): Promise<void> {
    const app = Consumer.create({
      queueUrl: this.sqsUrls.get(queueName),
      region: 'us-east-1',
      handleMessage: async (msg) => {
        await cb(msg.Body);
      },
    });
    app.start();
  }
}
