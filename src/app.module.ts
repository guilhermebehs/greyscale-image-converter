import { Module } from '@nestjs/common';
import { FileReceiverModule } from './file-receiver/file-receiver.module';
import { InfraModule } from './infra/infra.module';
import { GreyscaleConverterModule } from './greyscale-converter/greyscale-converter.module';
import { S3UploaderModule } from './s3-uploader/s3-uploader.module';

@Module({
  imports: [
    FileReceiverModule,
    InfraModule,
    GreyscaleConverterModule,
    S3UploaderModule,
  ],
  controllers: [],
})
export class AppModule {}
