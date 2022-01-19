import BroadcastChannel, { FakeChannel, messageEvent } from './index';
import * as faker from 'faker';

interface TestMessage {
  type: string,
  payload: ArrayLike<string | number>
}


describe('@lnsd/broadcast-channel - Acceptance tests', () => {

  function getBroadcastChannelInstance(name: string) {
    const options = { backend: FakeChannel };
    const channel = new BroadcastChannel<TestMessage>(name, options);
    channel.onmessage = jest.fn();
    channel.onmessageerror = jest.fn();

    return channel;
  }

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeAll(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('constructor', () => {
    /* Given */
    const channelName = faker.datatype.string(12);
    const channelA = getBroadcastChannelInstance(channelName);
    const channelB = getBroadcastChannelInstance(channelName);

    /* When */
    const expectedMessage: TestMessage = {
      type: faker.datatype.hexaDecimal(22),
      payload: faker.datatype.array(12),
    };
    channelA.postMessage(expectedMessage);

    jest.runAllTimers();

    /* Then */
    expect(channelB.onmessage).toHaveBeenCalledTimes(1);
    expect(channelB.onmessage).toHaveBeenLastCalledWith(messageEvent<TestMessage>(expectedMessage));
  });
});
