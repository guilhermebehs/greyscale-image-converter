import { Inject, Injectable } from '@nestjs/common';
import { rmSync } from 'fs';
import { UploadImageCommand } from 'src/dtos';
import { Queue } from '@src/infra/enums/queue';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';
import { RemoteStorageAdapter } from '@src/infra/remote-storage-adapter/remote-storage-adapter.service';

@Injectable()
export class UploaderService {
  constructor(
    @Inject('QueueConnector')
    private readonly queueConnector: QueueConnector,
    private readonly remoteStorageAdapter: RemoteStorageAdapter,
  ) {
    this.bindListener();
  }

  async upload({ imageName }: UploadImageCommand) {
    await this.remoteStorageAdapter.uploadFile(imageName);
    rmSync(`./files/${imageName}`);
  }
  private bindListener() {
    const cb = async (msg: string) => {
      const command = JSON.parse(msg) as UploadImageCommand;
      await this.upload(command);
    };

    this.queueConnector.bindListener(Queue.UPLOAD_IMAGE_QUEUE, cb);
  }
}
