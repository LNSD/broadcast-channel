import { Channel, ChannelFactory, OnMessageListener } from './channel';
import { defer, uuidv4 } from '../utils';
import { deserialize, serialize, SerializedRecord } from '@ungap/structured-clone';
import { messageErrorEvent, messageEvent } from './message-event';

// Fixture management

const fakeChannels: Map<string, Set<FakeChannel>> = new Map();

export function resetFakeChannel() {
  fakeChannels.clear();
}


// Channel

class FakeChannel implements Channel {
  readonly uuid: string = uuidv4();

  public _onmessage: OnMessageListener | null = null;
  private _onmessageerror: OnMessageListener | null = null;

  private closed = false;

  constructor(private readonly name: string) {
  }

  onmessage<T>(listener: OnMessageListener<T>): void {
    this._onmessage = ev => {
      listener(new MessageEvent('message', { data: deserialize(ev.data) }));
    };
  }

  onmessageerror<E>(listener: OnMessageListener<E>): void {
    this._onmessageerror = listener;
  }

  close(): void {
    if (this.closed) {
      return;
    }

    const listeners = fakeChannels.get(this.name);
    if (listeners === undefined) {
      return;
    }

    listeners.delete(this);

    if (listeners.size === 0) {
      fakeChannels.delete(this.name);
    }

    this.closed = true;
  }

  postMessage(message: any): void {
    if (this.closed) {
      return;
    }

    // Data serialization
    let data: SerializedRecord;
    try {
      data = serialize(message);
    } catch (err: any) {
      this.dispatchMessageError(new DOMException(`Uncloneable value: ${err.message}`, 'DataCloneError'));
      return;
    }

    defer(() => this.dispatchMessage(data));
  }

  private dispatchMessage(data: any) {
    const listeners = fakeChannels.get(this.name);
    if (listeners === undefined) {
      return;
    }

    for (const channel of listeners) {
      if (channel === this) {
        continue;
      }

      if (channel._onmessage !== null) {
        channel._onmessage(messageEvent(data));
      }
    }
  }

  private dispatchMessageError(err: Error) {
    if (this._onmessageerror === null) {
      return;
    }
    this._onmessageerror(messageErrorEvent(err));
  }
}


// Factory

const factory: ChannelFactory = {
  optionsKey: 'fake',

  getChannel(name: string): Channel {
    const channel = new FakeChannel(name);

    let listeners = fakeChannels.get(name);
    if (listeners === undefined) {
      listeners = new Set<FakeChannel>();
    }

    listeners.add(channel);
    fakeChannels.set(name, listeners);

    return channel;
  },

  canBeUsed(): boolean {
    return true;
  },
};

export default factory;
