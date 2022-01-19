import type { BroadcastChannel, BroadcastChannelEventTarget, OnMessageListener } from './types';

import EventTarget from '@ungap/event-target';
import { Channel, defaultChannelsList, getOptimalChannel } from './channel';
import { Options } from './options';

function channel(name: string, options?: Options): Channel {
  const channelFactory = options?.backend ?? getOptimalChannel(...defaultChannelsList);
  if (channelFactory === null) {
    throw new Error('BroadcastChannel cannot be used. Not supported');
  }

  // Get channel specific options
  const channelOptions = options?.options?.[channelFactory.optionsKey];

  // Create backend channel instance
  return channelFactory.getChannel(name, channelOptions);
}

export class BroadcastChannelInstance<T> implements BroadcastChannel<T> {
  private channel: Channel | null;

  private emitter: BroadcastChannelEventTarget<T> = new EventTarget();
  addEventListener = this.emitter.addEventListener.bind(this);
  removeEventListener = this.emitter.removeEventListener.bind(this);
  dispatchEvent = this.emitter.dispatchEvent.bind(this);

  constructor(public readonly name: string, options?: Options) {
    this.channel = channel(name, options);
    this.channel.onmessage<T>(ev => {
      this._onmessage?.(ev);
      this.emitter.dispatchEvent(ev);
    });
    this.channel.onmessageerror<T>(ev => {
      this._onmessageerror?.(ev);
      this.emitter.dispatchEvent(ev);
    });
  }

  private _onmessage: OnMessageListener<T> | null = null;

  get onmessage(): OnMessageListener<T> | null {
    return this._onmessage;
  }

  set onmessage(listener: OnMessageListener<T> | null) {
    if (!listener) {
      return;
    }
    this._onmessage = listener;
  }

  private _onmessageerror: OnMessageListener<T> | null = null;

  get onmessageerror(): OnMessageListener<T> | null {
    return this._onmessageerror;
  }

  set onmessageerror(listener: OnMessageListener<T> | null) {
    if (!listener) {
      return;
    }
    this._onmessageerror = listener;
  }

  close(): void {
    if (this.channel === null) {
      return;
    }

    this.channel.close();
    this.channel = null;
  }

  postMessage(message: T): void {
    if (this.channel === null) {
      throw new DOMException('Already closed', 'InvalidStateError');
    }

    this.channel.postMessage(message);
  }
}
