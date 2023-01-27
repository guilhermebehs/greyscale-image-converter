import { Injectable } from '@nestjs/common';
import Jimp from 'jimp';

@Injectable()
export class ImageEditorAdapter {
  async greyscale(imagePath: string): Promise<void> {
    const image = await Jimp.read(imagePath);
    image.greyscale().write(imagePath);
  }
}
