import { TestingModule, Test } from '@nestjs/testing';
import { GreyscaleConverterService } from '@greyscale-converter/greyscale-converter.service';
import { ImageEditorAdapter } from '@infra/image-editor-adapter/image-editor-adapter.service';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';
import { Counter } from 'prom-client';

describe('GreyscaleConverterService', () => {
  let queueConnector: QueueConnector;
  let imageEditorAdapter: ImageEditorAdapter;
  let greyscaleConverterService: GreyscaleConverterService;
  let moduleTest: TestingModule;
  let queueConnectorMock;
  let counterSuccess;
  let counterFailure;

  beforeAll(async () => {
    queueConnectorMock = {
      bindListener: () => {},
      notifyUploadImage: () => {},
    };
    jest.useFakeTimers().setSystemTime(new Date());

    moduleTest = await Test.createTestingModule({
      providers: [
        GreyscaleConverterService,
        {
          provide: 'PROM_METRIC_GREYSCALE_APPLIED_SUCCESS',
          useValue: {
            inc: () => {},
          },
        },
        {
          provide: 'PROM_METRIC_GREYSCALE_APPLIED_FAILURE',
          useValue: {
            inc: () => {},
          },
        },
        {
          provide: Counter<string>,
          useValue: {
            inc: () => {},
          },
        },
        {
          provide: ImageEditorAdapter,
          useValue: {
            greyscale: async () => {},
          },
        },
        {
          provide: 'QueueConnector',
          useValue: queueConnectorMock,
        },
      ],
    }).compile();

    greyscaleConverterService = moduleTest.get<GreyscaleConverterService>(
      GreyscaleConverterService,
    );
    queueConnector = moduleTest.get<QueueConnector>('QueueConnector');
    imageEditorAdapter = moduleTest.get<ImageEditorAdapter>(ImageEditorAdapter);
    counterSuccess = moduleTest.get('PROM_METRIC_GREYSCALE_APPLIED_SUCCESS');
    counterFailure = moduleTest.get('PROM_METRIC_GREYSCALE_APPLIED_FAILURE');
  });

  afterAll(async () => {
    await moduleTest.close();
  });

  test('should convert correctly', async () => {
    const imageName = 'some image';
    const queueConnectorSpy = jest.spyOn(queueConnector, 'notifyUploadImage');
    const imageEditorAdapterSpy = jest.spyOn(imageEditorAdapter, 'greyscale');
    const counterSuccessSpy = jest.spyOn(counterSuccess, 'inc');
    const counterFailureSpy = jest.spyOn(counterFailure, 'inc');

    await greyscaleConverterService.convert({
      imageName,
      ocurredAt: new Date(),
    });

    expect(queueConnectorSpy).toBeCalledTimes(1);
    expect(queueConnectorSpy).toBeCalledWith({
      imageName,
      ocurredAt: new Date(),
    });
    expect(imageEditorAdapterSpy).toBeCalledTimes(1);
    expect(imageEditorAdapterSpy).toBeCalledWith(`./files/${imageName}`);
    expect(counterSuccessSpy).toHaveBeenCalledTimes(1);
    expect(counterFailureSpy).toHaveBeenCalledTimes(0);
  });
});
