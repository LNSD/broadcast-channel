import { Channel, ChannelFactory } from './channel';
import { default as NativeChannel } from './native';
import { default as LocalStorageChannel, Options as LocalStorageOptions } from './localstorage';
import { default as FakeChannel } from './fake';
import { messageErrorEvent, messageEvent } from './message-event';


const defaultChannelsList: Array<ChannelFactory> = [NativeChannel, LocalStorageChannel];

function getOptimalChannel(...channels: ChannelFactory[]): ChannelFactory | null {
  const factory = channels.find(channelFactory => channelFactory.canBeUsed());
  if (factory === undefined) {
    return null;
  }

  return factory;
}


export {
  Channel, ChannelFactory,
  NativeChannel,
  LocalStorageChannel, LocalStorageOptions,
  FakeChannel,
  defaultChannelsList,
  getOptimalChannel,
  messageEvent, messageErrorEvent,
};
