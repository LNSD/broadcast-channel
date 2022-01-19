import { default as LocalStorageChannel, resetLocalStorage } from './localstorage';
import * as faker from 'faker';
import { messageEvent } from './message-event';

interface TestMessage {
  type: string,
  payload: ArrayLike<string | number>
}

describe('channel/localstorage', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllTimers();
    resetLocalStorage();
  });

  it('should listen to the channel and receive message events', () => {
    /* Given */
    const channelName = faker.datatype.string(12);
    const channelA = LocalStorageChannel.getChannel(channelName);
    const channelB = LocalStorageChannel.getChannel(channelName);

    const onMessageListenerA = jest.fn();
    channelA.onmessage(onMessageListenerA);

    const onMessageListenerB = jest.fn();
    channelB.onmessage(onMessageListenerB);

    /* When */
    const expectedMessage: TestMessage = {
      type: faker.datatype.hexaDecimal(22),
      payload: faker.datatype.array(12),
    };
    channelA.postMessage(expectedMessage);

    jest.runAllTimers();

    /* Then */
    expect(onMessageListenerA).toHaveBeenCalledTimes(0);

    expect(onMessageListenerB).toHaveBeenCalledTimes(1);
    expect(onMessageListenerB).toHaveBeenLastCalledWith(messageEvent<TestMessage>(expectedMessage));
  });

  it('should not send the message event if channels is closed', () => {
    /* Given */
    const channelName = faker.datatype.string(12);
    const channelA = LocalStorageChannel.getChannel(channelName);
    const channelB = LocalStorageChannel.getChannel(channelName);

    const onMessageListenerA = jest.fn();
    channelA.onmessage(onMessageListenerA);

    const onMessageListenerB = jest.fn();
    channelB.onmessage(onMessageListenerB);

    /* When */
    channelA.close();

    const expectedMessage: TestMessage = {
      type: faker.datatype.hexaDecimal(22),
      payload: faker.datatype.array(12),
    };
    channelA.postMessage(expectedMessage);

    /* Then */
    expect(onMessageListenerA).toHaveBeenCalledTimes(0);
    expect(onMessageListenerB).toHaveBeenCalledTimes(0);
  });

  it('should not trigger its own on message listener', () => {
    /* Given */
    const channelName = faker.datatype.string(12);
    const channel = LocalStorageChannel.getChannel(channelName);

    const onMessageListener = jest.fn();
    channel.onmessage(onMessageListener);

    /* When */
    const expectedMessage: TestMessage = {
      type: faker.datatype.hexaDecimal(22),
      payload: faker.datatype.array(12),
    };
    channel.postMessage(expectedMessage);

    /* Then */
    expect(onMessageListener).toHaveBeenCalledTimes(0);
  });

  it('should close the channel instance and not listen to the event', () => {
    /* Given */
    const channelName = faker.datatype.string(12);
    const channelA = LocalStorageChannel.getChannel(channelName);
    const channelB = LocalStorageChannel.getChannel(channelName);

    const onMessageListenerA = jest.fn();
    channelA.onmessage(onMessageListenerA);

    const onMessageListenerB = jest.fn();
    channelB.onmessage(onMessageListenerB);

    /* When */
    channelB.close();

    const expectedMessage: TestMessage = {
      type: faker.datatype.hexaDecimal(22),
      payload: faker.datatype.array(12),
    };
    channelA.postMessage(expectedMessage);

    /* Then */
    expect(onMessageListenerA).toHaveBeenCalledTimes(0);
    expect(onMessageListenerB).toHaveBeenCalledTimes(0);
  });

  it('should clean up the channel instance and not listen to the event', () => {
    /* Given */
    const channelName = faker.datatype.string(12);
    const channelA = LocalStorageChannel.getChannel(channelName);
    const channelB = LocalStorageChannel.getChannel(channelName);

    const onMessageListenerA = jest.fn();
    channelA.onmessage(onMessageListenerA);

    const onMessageListenerB = jest.fn();
    channelB.onmessage(onMessageListenerB);

    /* When */
    channelA.close();
    channelB.close();

    const expectedMessage: TestMessage = {
      type: faker.datatype.hexaDecimal(22),
      payload: faker.datatype.array(12),
    };
    channelA.postMessage(expectedMessage);

    /* Then */
    expect(onMessageListenerA).toHaveBeenCalledTimes(0);
    expect(onMessageListenerB).toHaveBeenCalledTimes(0);
  });
});
