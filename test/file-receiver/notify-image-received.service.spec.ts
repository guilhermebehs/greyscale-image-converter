import { Test, TestingModule } from '@nestjs/testing';
import { NotifyImageReceivedService } from '@src/file-receiver/notify-image-received.service';
import { RabbitConnector } from '@infra/rabbit-connector/rabbit-connector.service';

describe('NotifyImageReceivedService', () => {
  let rabbitMqConnector: RabbitConnector;
  let notifyImageReceivedService: NotifyImageReceivedService;
  let moduleTest: TestingModule;

  beforeAll(async () => {
    jest.useFakeTimers().setSystemTime(new Date());

    moduleTest = await Test.createTestingModule({
      providers: [
        NotifyImageReceivedService,
        {
          provide: RabbitConnector,
          useValue: {
            notifyImageReceived: async () => {},
          },
        },
      ],
    }).compile();

    notifyImageReceivedService = moduleTest.get<NotifyImageReceivedService>(
      NotifyImageReceivedService,
    );
    rabbitMqConnector = moduleTest.get<RabbitConnector>(RabbitConnector);
  });

  afterAll(async () => {
    await moduleTest.close();
  });

  test('should notify correctly', async () => {
    const imageName = 'some image';
    const rabbitMqConnectorSpy = jest.spyOn(
      rabbitMqConnector,
      'notifyImageReceived',
    );
    await notifyImageReceivedService.notify(imageName);

    expect(rabbitMqConnectorSpy).toBeCalledTimes(1);
    expect(rabbitMqConnectorSpy).toBeCalledWith({
      imageName,
      ocurredAt: new Date(),
    });
  });
});
