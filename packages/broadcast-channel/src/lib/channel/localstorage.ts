/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */
import { Channel, ChannelFactory, OnMessageListener } from './channel';
import { defer, uuidv4 } from '../utils';
import { ObliviousSet } from 'oblivious-set';
import { deserialize, serialize, SerializedRecord } from '@ungap/structured-clone';
import { messageErrorEvent, messageEvent } from './message-event';


// Options

export type Options = {
  removeTimeout: number,
}

export const defaultOptions: Options = {
  removeTimeout: 60 * 1000,
};


// LocalStorage

type StorageEventListener = (ev: StorageEvent) => void;

function getLocalStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  let localStorage;
  try {
    localStorage = window.localStorage;
  } catch (e) {
    // New versions of Firefox throw a Security exception
    // if cookies are disabled. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
  }

  return localStorage;
}

function storageEventListener(key: string, listener: (storageObject: StorageObject) => void) {
  return (ev: StorageEvent) => {
    if (ev.key !== key || ev.newValue === null) {
      return;
    }

    listener(JSON.parse(ev.newValue));
  };
}

function addStorageEventListener(listener: StorageEventListener) {
  window.addEventListener('storage', listener);
}

function removeStorageEventListener(listener: StorageEventListener) {
  window.removeEventListener('storage', listener);
}

export function resetLocalStorage() {
  const localStorage = getLocalStorage();
  if (localStorage === undefined) {
    throw new Error('BroadcastChannel: LocalStorage is not available');
  }

  // Remove all BroadcastChannel entries
  Object.keys(localStorage)
    .filter(key => key.startsWith(KEY_PREFIX))
    .forEach(key => localStorage.removeItem(key));
}


// Channel

interface StorageObject {
  token: string;
  data: SerializedRecord,
  senderId: string;
}

const KEY_PREFIX = 'lnsd/broadcast-channel-';

class LocalStorage implements Channel {
  private readonly uuid: string = uuidv4();

  private closed = false;

  /**
   * Contains all messages that have been emitted before
   */
  private readonly emittedMessagesIds: ObliviousSet;

  private readonly storageListener: StorageEventListener;

  private _onmessage: OnMessageListener | null = null;
  private _onmessageerror: OnMessageListener | null = null;

  constructor(private readonly name: string, options?: Partial<Options>) {
    const localStorage = getLocalStorage();
    if (localStorage === undefined) {
      throw new Error('BroadcastChannel: LocalStorage not available');
    }

    const channelOptions = Object.assign({}, defaultOptions, options);
    this.emittedMessagesIds = new ObliviousSet(channelOptions.removeTimeout);

    this.storageListener = storageEventListener(this.storageKey, ({ senderId, token, data }) => {
      // No listener
      if (this._onmessage === null) {
        return;
      }

      // Own message
      if (senderId === this.uuid) {
        return;
      }

      // Already emitted
      if (this.emittedMessagesIds.has(token)) {
        return;
      }
      this.emittedMessagesIds.add(token);

      this._onmessage(messageEvent(data));
    });
    addStorageEventListener(this.storageListener);
  }

  private get storageKey(): string {
    return KEY_PREFIX + this.name;
  }

  onmessage<T>(listener: OnMessageListener<T>): void {
    this._onmessage = ev => listener(messageEvent<T>(deserialize(ev.data)));
  }

  onmessageerror<E>(listener: OnMessageListener<E>): void {
    this._onmessageerror = listener;
  }

  close(): void {
    if (this.closed) {
      return;
    }

    removeStorageEventListener(this.storageListener);
    this.closed = true;
  }

  /**
   * Writes the new message to the storage and fires the storage-event
   * so other readers can find it.
   */
  postMessage(message: any): void {
    if (this.closed) {
      return;
    }

    const localStorage = getLocalStorage();
    if (localStorage === undefined) {
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
    const key = this.storageKey;
    const writeObj: StorageObject = {
      token: uuidv4(),
      senderId: this.uuid,
      data: data,
    };

    const newValue = JSON.stringify(writeObj);
    localStorage.setItem(key, newValue);

    /**
     * StorageEvent does not fire the 'storage' event in the window that
     * changes the state of the local storage. So we fire it manually.
     */
    window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
  }

  private dispatchMessageError(err: Error) {
    if (this._onmessageerror === null) {
      return;
    }
    this._onmessageerror(messageErrorEvent(err));
  }
}


// Factory

const factory: ChannelFactory<Options> = {
  optionsKey: 'localstorage',

  getChannel(name: string, options?: Partial<Options>): Channel {
    return new LocalStorage(name, options);
  },

  canBeUsed() {
    const localstorage = getLocalStorage();
    if (localstorage === undefined) {
      return false;
    }

    try {
      const key = '__broadcastchannel_check';
      localstorage.setItem(key, 'works');
      localstorage.removeItem(key);
    } catch (e) {
      // Safari 10 in private mode will not allow write access to local storage o
      // and fail with a QuotaExceededError. See:
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API#Private_Browsing_Incognito_modes
      return false;
    }

    return true;
  },
};


export default factory;
