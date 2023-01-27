import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { UploaderService } from './uploader.service';

@Module({
  imports: [InfraModule],
  providers: [UploaderService],
})
export class UploaderModule {}
