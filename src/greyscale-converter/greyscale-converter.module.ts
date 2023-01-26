import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { GreyscaleConverterService } from './greyscale-converter.service';

@Module({
  imports: [InfraModule],
  providers: [GreyscaleConverterService],
})
export class GreyscaleConverterModule {}
