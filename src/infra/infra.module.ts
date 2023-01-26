import { Module } from '@nestjs/common';
import { RabbitConnectorService } from './rabbit-connector/rabbit-connector.service';
import { S3Service } from './s3/s3.service';

@Module({
  providers: [
    {
      provide: RabbitConnectorService,
      useFactory: async () => {
        const rabbitMq = new RabbitConnectorService();
        await rabbitMq.connect();
        return rabbitMq;
      },
    },
    S3Service,
  ],
  exports: [RabbitConnectorService, S3Service],
})
export class InfraModule {}
