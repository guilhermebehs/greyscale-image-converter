import { TestingModule, Test } from '@nestjs/testing';
import { GreyscaleConverterService } from '@greyscale-converter/greyscale-converter.service';
import { ImageEditorAdapter } from '@infra/image-editor-adapter/image-editor-adapter.service';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';

describe('GreyscaleConverterService', () => {
  let queueConnector: QueueConnector;
  let imageEditorAdapter: ImageEditorAdapter;
  let greyscaleConverterService: GreyscaleConverterService;
  let moduleTest: TestingModule;
  let queueConnectorMock;

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
  });

  afterAll(async () => {
    await moduleTest.close();
  });

  test('should convert correctly', async () => {
    const imageName = 'some image';
    const queueConnectorSpy = jest.spyOn(queueConnector, 'notifyUploadImage');
    const imageEditorAdapterSpy = jest.spyOn(imageEditorAdapter, 'greyscale');

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
  });
});
