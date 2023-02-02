import { Module } from '@nestjs/common';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { InfraModule } from 'src/infra/infra.module';
import { GreyscaleConverterService } from './greyscale-converter.service';

@Module({
  imports: [InfraModule],
  providers: [
    GreyscaleConverterService,
    makeCounterProvider({
      name: 'greyscale_applied_success',
      help: 'number of greyscale applications with successful',
    }),
    makeCounterProvider({
      name: 'greyscale_applied_failure',
      help: 'number of greyscale applications with failure',
    }),
  ],
})
export class GreyscaleConverterModule {}
