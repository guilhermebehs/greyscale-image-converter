import { Queue } from '../enums/queue';

function mapQueueNameToSQSUrl(): Map<string, string> {
  const QueueUrl = new Map<string, string>();

  QueueUrl.set(Queue.IMAGE_RECEIVED_QUEUE, process.env.IMAGE_RECEIVED_SQS_URL);
  QueueUrl.set(Queue.UPLOAD_IMAGE_QUEUE, process.env.UPLOAD_IMAGE_SQS_URL);
  return QueueUrl;
}

export default mapQueueNameToSQSUrl;
