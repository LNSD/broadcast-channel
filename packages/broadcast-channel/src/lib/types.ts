export interface MessageEvent<T = any> extends Event {
  /**
   * Returns the data of the message.
   */
  readonly data: T;

  /**
   * Returns the last event ID string, for server-sent events.
   */
  readonly lastEventId: string;

  /**
   * Returns the origin of the message, for server-sent events and
   * cross-document messaging.
   */
  readonly origin: string;

  /**
   * Returns the MessagePort array sent with the message, for cross-document
   * messaging and channel messaging.
   */
  readonly ports: ReadonlyArray<MessagePort>;

  /**
   * Returns the WindowProxy of the source window, for cross-document messaging,
   * and the MessagePort being attached, in the connect event fired at
   * SharedWorkerGlobalScope objects.
   */
  readonly source: MessageEventSource | null;
}

export interface BroadcastChannelEventMap<T> {
  'message': MessageEvent<T>;
  'messageerror': MessageEvent<T>;
}

export type OnMessageListener<T> = (this: BroadcastChannel<T>, ev: MessageEvent<T>) => any;

export interface BroadcastChannelEventTarget<T> extends EventTarget {
  addEventListener<K extends keyof BroadcastChannelEventMap<T>>(type: K, listener: (this: BroadcastChannel<T>, ev: BroadcastChannelEventMap<T>[K]) => any, options?: boolean | AddEventListenerOptions): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof BroadcastChannelEventMap<T>>(type: K, listener: (this: BroadcastChannel<T>, ev: BroadcastChannelEventMap<T>[K]) => any, options?: boolean | EventListenerOptions): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export interface BroadcastChannel<T = any> extends BroadcastChannelEventTarget<T> {
  /**
   * Returns the channel name (as passed to the constructor).
   */
  readonly name: string;

  onmessage: OnMessageListener<T> | null;

  onmessageerror: OnMessageListener<T> | null;

  /**
   * Closes the BroadcastChannel object, opening it up to garbage collection.
   */
  close(): void;

  /**
   * Sends the given message to other BroadcastChannel objects set up for this
   * channel. Messages can be structured objects, e.g. nested objects and
   * arrays.
   */
  postMessage(message: T): void;
}
