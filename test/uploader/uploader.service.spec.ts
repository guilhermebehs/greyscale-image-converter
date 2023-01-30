import { TestingModule, Test } from '@nestjs/testing';
import { RemoteStorageAdapter } from '@src/infra/remote-storage-adapter/remote-storage-adapter.service';
import { UploaderService } from '@src/uploader/uploader.service';
import fs from 'fs';

jest.mock('fs');

describe('UploaderService', () => {
  let uploaderService: UploaderService;
  let remoteStorageAdapter: RemoteStorageAdapter;
  let moduleTest: TestingModule;

  beforeAll(async () => {
    moduleTest = await Test.createTestingModule({
      providers: [
        UploaderService,
        {
          provide: RemoteStorageAdapter,
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
    remoteStorageAdapter =
      moduleTest.get<RemoteStorageAdapter>(RemoteStorageAdapter);
  });

  afterAll(async () => {
    await moduleTest.close();
  });

  test('should upload correctly', async () => {
    const imageName = 'some image';
    const remoteStorageAdapterSpy = jest.spyOn(
      remoteStorageAdapter,
      'uploadFile',
    );
    const fsSpy = jest.spyOn(fs, 'rmSync');

    await uploaderService.upload({
      imageName,
      ocurredAt: new Date(),
    });

    expect(remoteStorageAdapterSpy).toBeCalledTimes(1);
    expect(remoteStorageAdapterSpy).toBeCalledWith(imageName);
    expect(fsSpy).toBeCalledTimes(1);
    expect(fsSpy).toBeCalledWith(`./files/${imageName}`);
  });
});
