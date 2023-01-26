import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { S3UploaderService } from './s3-uploader.service';

@Module({
  imports: [InfraModule],
  providers: [S3UploaderService],
})
export class S3UploaderModule {}
