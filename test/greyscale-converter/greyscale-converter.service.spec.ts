import { TestingModule, Test } from '@nestjs/testing';
import { GreyscaleConverterService } from '@greyscale-converter/greyscale-converter.service';
import { RabbitConnector } from '@infra/rabbit-connector/rabbit-connector.service';
import { ImageEditorAdapter } from '@infra/image-editor-adapter/image-editor-adapter.service';

describe('GreyscaleConverterService', () => {
  let rabbitMqConnector: RabbitConnector;
  let imageEditorAdapter: ImageEditorAdapter;
  let greyscaleConverterService: GreyscaleConverterService;
  let moduleTest: TestingModule;
  let rabbitConnectorMock;

  beforeAll(async () => {
    rabbitConnectorMock = {
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
          provide: RabbitConnector,
          useValue: rabbitConnectorMock,
        },
      ],
    }).compile();

    greyscaleConverterService = moduleTest.get<GreyscaleConverterService>(
      GreyscaleConverterService,
    );
    rabbitMqConnector = moduleTest.get<RabbitConnector>(RabbitConnector);
    imageEditorAdapter = moduleTest.get<ImageEditorAdapter>(ImageEditorAdapter);
  });

  afterAll(async () => {
    await moduleTest.close();
  });

  test('should convert correctly', async () => {
    const imageName = 'some image';
    const rabbitMqConnectorSpy = jest.spyOn(
      rabbitMqConnector,
      'notifyUploadImage',
    );
    const imageEditorAdapterSpy = jest.spyOn(imageEditorAdapter, 'greyscale');

    await greyscaleConverterService.convert({
      imageName,
      ocurredAt: new Date(),
    });

    expect(rabbitMqConnectorSpy).toBeCalledTimes(1);
    expect(rabbitMqConnectorSpy).toBeCalledWith({
      imageName,
      ocurredAt: new Date(),
    });
    expect(imageEditorAdapterSpy).toBeCalledTimes(1);
    expect(imageEditorAdapterSpy).toBeCalledWith(`./files/${imageName}`);
  });
});
