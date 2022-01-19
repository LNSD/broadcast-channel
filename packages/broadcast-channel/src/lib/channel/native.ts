import { Channel, ChannelFactory, OnMessageListener } from './channel';


// Channel

class NativeChannel implements Channel {
  private readonly channel: BroadcastChannel;

  constructor(name: string) {
    this.channel = new BroadcastChannel(name);
  }

  onmessage<T>(cb: OnMessageListener<T>): void {
    this.channel.onmessage = cb;
  }

  onmessageerror<T>(cb: OnMessageListener<T>): void {
    this.channel.onmessageerror = cb;
  }

  close(): void {
    this.channel.close();
  }

  postMessage(message: any): void {
    this.channel.postMessage(message);
  }
}


// Factory

const factory: ChannelFactory = {
  optionsKey: 'native',

  getChannel(name: string): Channel {
    return new NativeChannel(name);
  },

  canBeUsed(): boolean {
    return typeof BroadcastChannel === 'function';
  },
};

export default factory;
