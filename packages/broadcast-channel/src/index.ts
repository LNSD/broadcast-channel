import { BroadcastChannel } from './lib/types';
import { Options } from './lib/options';
import { BroadcastChannelInstance } from './lib/broadcast-channel';


export {
  Channel, ChannelFactory,
  NativeChannel,
  LocalStorageChannel, LocalStorageOptions,
  FakeChannel,
  messageEvent, messageErrorEvent
} from './lib/channel';
export type { MessageEvent, OnMessageListener, BroadcastChannel } from './lib/types';

export default BroadcastChannelInstance as {
  prototype: BroadcastChannel;
  new<T>(name: string, options?: Options): BroadcastChannel<T>;
};
