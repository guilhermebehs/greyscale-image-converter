import { Channel, connect } from 'amqplib';
import { SendImageToS3Command, ImageReceivedEvent } from 'src/dtos';
import { Exchange } from './exchange';
import { Queue } from './queue';

export class RabbitConnectorService {
  private channel: Channel;

  async connect() {
    try {
      const connection = await connect(process.env.RABBIT_HOST);
      this.channel = await connection.createChannel();
      await this.createExchanges();
      await this.createQueues();
      console.log('connected to rabbitmq!');
    } catch (e) {
      console.error('error connecting to rabbitmq:', e);
    }
  }

  private async createExchanges() {
    this.channel.assertExchange(Exchange.IMAGE_RECEIVED_EXCHANGE, 'fanout', {
      durable: false,
    });

    this.channel.assertExchange(Exchange.SEND_IMAGE_TO_S3_EXCHANGE, 'fanout', {
      durable: false,
    });
  }

  private async createQueues() {
    await this.channel.assertQueue(Queue.IMAGE_RECEIVED_QUEUE, {
      durable: false,
    });
    await this.channel.bindQueue(
      Queue.IMAGE_RECEIVED_QUEUE,
      Exchange.IMAGE_RECEIVED_EXCHANGE,
      '',
    );

    await this.channel.assertQueue(Queue.SEND_IMAGE_TO_S3_QUEUE, {
      durable: false,
    });
    await this.channel.bindQueue(
      Queue.SEND_IMAGE_TO_S3_QUEUE,
      Exchange.SEND_IMAGE_TO_S3_EXCHANGE,
      '',
    );
  }

  async notifyImageReceived(imageReceived: ImageReceivedEvent) {
    const imageReceivedStr = JSON.stringify(imageReceived);

    this.channel.publish(
      Exchange.IMAGE_RECEIVED_EXCHANGE,
      '',
      Buffer.from(imageReceivedStr),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  async notifySendImageToS3(sendImageToS3: SendImageToS3Command) {
    const sendImageToS3Str = JSON.stringify(sendImageToS3);

    this.channel.publish(
      Exchange.SEND_IMAGE_TO_S3_EXCHANGE,
      '',
      Buffer.from(sendImageToS3Str),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  async bindListener(queueName: Queue, cb: any) {
    this.channel.consume(queueName, cb, { noAck: true });
  }
}
