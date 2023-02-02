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
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { NotifyImageReceivedService } from './notify-image-received.service';

@Controller({ path: 'file-receiver' })
export class FileReceiverController {
  private readonly logger = new Logger(FileReceiverController.name);

  constructor(
    private readonly notifyImageReceivedService: NotifyImageReceivedService,
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

      this.logger.log(`(updloadFile) File saved: ${image.originalname}`);

      await this.notifyImageReceivedService.notify(name);
    } catch (e) {
      this.logger.error(
        `(updloadFile) Error saving file ${image.originalname}: ${e.message}`,
      );
    }
  }
}
