import {
  Controller,
  FileTypeValidator,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { createWriteStream } from 'fs';
import { Counter } from 'prom-client';
import { Readable } from 'stream';
import { NotifyImageReceivedService } from './notify-image-received.service';

@Controller({ path: 'file-receiver' })
export class FileReceiverController {
  private readonly logger = new Logger(FileReceiverController.name);

  constructor(
    private readonly notifyImageReceivedService: NotifyImageReceivedService,
    @InjectMetric('file_received_success')
    private readonly fileReceivedSuccess: Counter<string>,
    @InjectMetric('file_received_failure')
    private readonly fileReceivedFailure: Counter<string>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async updloadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5485760 }),
          new FileTypeValidator({ fileType: 'jpeg|png' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    try {
      this.logger.log(`(updloadFile) File received: ${image.originalname}`);

      const name = image.originalname + '_' + new Date().getTime();

      Readable.from(image.buffer).pipe(createWriteStream(`./files/${name}`));

      await this.notifyImageReceivedService.notify(name);

      this.fileReceivedSuccess.inc();

      this.logger.log(`(updloadFile) File saved: ${image.originalname}`);
    } catch (e) {
      this.fileReceivedFailure.inc();
      this.logger.error(
        `(updloadFile) Error saving file ${image.originalname}: ${e.message}`,
      );
    }
  }
}
