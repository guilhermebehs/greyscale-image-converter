import { Channel, connect } from 'amqplib';
import { ImageReceivedEvent, UploadImageCommand } from 'src/dtos';
import { Exchange } from './exchange';
import { Queue } from './queue';

export class RabbitConnector {
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

    this.channel.assertExchange(Exchange.UPLOAD_IMAGE_EXCHANGE, 'fanout', {
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

    await this.channel.assertQueue(Queue.UPLOAD_IMAGE_QUEUE, {
      durable: false,
    });
    await this.channel.bindQueue(
      Queue.UPLOAD_IMAGE_QUEUE,
      Exchange.UPLOAD_IMAGE_EXCHANGE,
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

  async notifyUploadImage(uploadImage: UploadImageCommand) {
    const uploadImageStr = JSON.stringify(uploadImage);

    this.channel.publish(
      Exchange.UPLOAD_IMAGE_EXCHANGE,
      '',
      Buffer.from(uploadImageStr),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  async bindListener(queueName: Queue, cb: any) {
    this.channel.consume(queueName, cb, { noAck: true });
  }
}
