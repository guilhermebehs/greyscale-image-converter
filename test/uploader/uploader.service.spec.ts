import { TestingModule, Test } from '@nestjs/testing';
import { UploaderService } from '@src/uploader/uploader.service';
import { CloudAdapter } from '@src/infra/cloud-adapter/cloud-adapter.service';
import fs from 'fs';

jest.mock('fs');

describe('UploaderService', () => {
  let uploaderService: UploaderService;
  let cloudAdapter: CloudAdapter;
  let moduleTest: TestingModule;

  beforeAll(async () => {
    moduleTest = await Test.createTestingModule({
      providers: [
        UploaderService,
        {
          provide: CloudAdapter,
          useValue: {
            uploadFile: async () => {},
          },
        },
        {
          provide: 'QueueConnector',
          useValue: {
            bindListener: () => {},
          },
        },
      ],
    }).compile();

    uploaderService = moduleTest.get<UploaderService>(UploaderService);
    cloudAdapter = moduleTest.get<CloudAdapter>(CloudAdapter);
  });

  afterAll(async () => {
    await moduleTest.close();
  });

  test('should upload correctly', async () => {
    const imageName = 'some image';
    const cloudAdapterSpy = jest.spyOn(cloudAdapter, 'uploadFile');
    const fsSpy = jest.spyOn(fs, 'rmSync');

    await uploaderService.upload({
      imageName,
      ocurredAt: new Date(),
    });

    expect(cloudAdapterSpy).toBeCalledTimes(1);
    expect(cloudAdapterSpy).toBeCalledWith(imageName);
    expect(fsSpy).toBeCalledTimes(1);
    expect(fsSpy).toBeCalledWith(`./files/${imageName}`);
  });
});
