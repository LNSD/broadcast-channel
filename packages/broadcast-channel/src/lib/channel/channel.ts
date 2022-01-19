import { MessageEvent } from '../types';

export type OnMessageListener<T = any> = (ev: MessageEvent<T>) => any;

export interface Channel {
  /**
   * Fired at an object when it receives a message.
   * See {@link https://html.spec.whatwg.org/multipage/indices.html#event-message}.
   *
   * @param listener - Event listener.
   */
  onmessage<T = any>(listener: OnMessageListener<T>): void,

  /**
   * Fired at an object when it receives a message that cannot be deserialized.
   * See {@link https://html.spec.whatwg.org/multipage/indices.html#event-messageerror}.
   *
   * @param listener - Event listener.
   */
  onmessageerror<E = Error>(listener: OnMessageListener<E>): void,

  close(): void,

  postMessage(message: any): void,
}

type Options<O> = Partial<O> | undefined;

export interface ChannelFactory<O = any> {
  readonly optionsKey: string;
  canBeUsed: () => boolean;
  getChannel: (name: string, options?: Options<O>) => Channel;
}
