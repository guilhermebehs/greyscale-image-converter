import { Inject, Injectable, Logger } from '@nestjs/common';
import { rmSync } from 'fs';
import { UploadImageCommand } from 'src/dtos';
import { Queue } from '@src/infra/enums/queue';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';
import { RemoteStorageAdapter } from '@src/infra/remote-storage-adapter/remote-storage-adapter.service';

@Injectable()
export class UploaderService {
  private readonly logger = new Logger(UploaderService.name);

  constructor(
    @Inject('QueueConnector')
    private readonly queueConnector: QueueConnector,
    private readonly remoteStorageAdapter: RemoteStorageAdapter,
  ) {
    this.bindListener();
  }

  async upload(uploadImageCommand: UploadImageCommand) {
    try {
      this.logger.log(
        `(upload) Message received: ${JSON.stringify(uploadImageCommand)}`,
      );
      const { imageName } = uploadImageCommand;
      await this.remoteStorageAdapter.uploadFile(imageName);
      rmSync(`./files/${imageName}`);

      this.logger.log(`(upload) Image ${imageName} sent to remote storage`);
    } catch (e) {
      this.logger.error(
        `(upload) Error sending image ${uploadImageCommand.imageName} to remote storage: ${e.message}`,
      );
    }
  }
  private bindListener() {
    const cb = async (msg: string) => {
      const command = JSON.parse(msg) as UploadImageCommand;
      await this.upload(command);
    };

    this.queueConnector.bindListener(Queue.UPLOAD_IMAGE_QUEUE, cb);
  }
}
