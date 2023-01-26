import {
  Controller,
  FileTypeValidator,
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
    const name = image.originalname + '_' + new Date().getTime();
    Readable.from(image.buffer).pipe(createWriteStream(`./files/${name}`));

    await this.notifyImageReceivedService.notify(name);
  }
}
