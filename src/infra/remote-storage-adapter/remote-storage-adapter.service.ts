import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import { createReadStream } from 'fs';

@Injectable()
export class RemoteStorageAdapter {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  }

  async uploadFile(fileName: string): Promise<void> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: createReadStream(`./files/${fileName}`),
    };

    await this.s3.upload(params).promise();
  }
}
