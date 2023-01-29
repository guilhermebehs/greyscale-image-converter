import { Test, TestingModule } from '@nestjs/testing';
import { NotifyImageReceivedService } from '@src/file-receiver/notify-image-received.service';
import { QueueConnector } from '@src/infra/interfaces/queue-connector';

describe('NotifyImageReceivedService', () => {
  let queueConnector: QueueConnector;
  let notifyImageReceivedService: NotifyImageReceivedService;
  let moduleTest: TestingModule;

  beforeAll(async () => {
    jest.useFakeTimers().setSystemTime(new Date());

    moduleTest = await Test.createTestingModule({
      providers: [
        NotifyImageReceivedService,
        {
          provide: 'QueueConnector',
          useValue: {
            notifyImageReceived: async () => {},
          },
        },
      ],
    }).compile();

    notifyImageReceivedService = moduleTest.get<NotifyImageReceivedService>(
      NotifyImageReceivedService,
    );
    queueConnector = moduleTest.get<QueueConnector>('QueueConnector');
  });

  afterAll(async () => {
    await moduleTest.close();
  });

  test('should notify correctly', async () => {
    const imageName = 'some image';
    const queueConnectorSpy = jest.spyOn(queueConnector, 'notifyImageReceived');
    await notifyImageReceivedService.notify(imageName);

    expect(queueConnectorSpy).toBeCalledTimes(1);
    expect(queueConnectorSpy).toBeCalledWith({
      imageName,
      ocurredAt: new Date(),
    });
  });
});
