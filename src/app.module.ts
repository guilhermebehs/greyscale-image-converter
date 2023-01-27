import { Module } from '@nestjs/common';
import { FileReceiverModule } from './file-receiver/file-receiver.module';
import { InfraModule } from './infra/infra.module';
import { GreyscaleConverterModule } from './greyscale-converter/greyscale-converter.module';
import { UploaderModule } from './uploader/uploader.module';

@Module({
  imports: [
    FileReceiverModule,
    InfraModule,
    GreyscaleConverterModule,
    UploaderModule,
  ],
  controllers: [],
})
export class AppModule {}
