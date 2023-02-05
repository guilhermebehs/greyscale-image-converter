import { Module } from '@nestjs/common';
import { FileReceiverModule } from './file-receiver/file-receiver.module';
import { InfraModule } from './infra/infra.module';
import { GreyscaleConverterModule } from './greyscale-converter/greyscale-converter.module';
import { UploaderModule } from './uploader/uploader.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    FileReceiverModule,
    InfraModule,
    GreyscaleConverterModule,
    UploaderModule,
    PrometheusModule.register({
      defaultLabels: { application: 'greyscale-image-converter' },
    }),
  ],
  controllers: [],
})
export class AppModule {}
