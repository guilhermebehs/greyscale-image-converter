import { Module } from '@nestjs/common';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { InfraModule } from 'src/infra/infra.module';
import { UploaderService } from './uploader.service';

@Module({
  imports: [InfraModule],
  providers: [
    UploaderService,
    makeCounterProvider({
      name: 'upload_success',
      help: 'number of uploads with successful',
    }),
    makeCounterProvider({
      name: 'upload_failure',
      help: 'number of uploads with failure',
    }),
  ],
})
export class UploaderModule {}
