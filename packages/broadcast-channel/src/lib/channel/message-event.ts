import { MessageEvent } from '../types';

export const messageEvent = <T = any>(data: T): MessageEvent => (new MessageEvent('message', { data }));

export const messageErrorEvent = <E = Error>(error: E): MessageEvent => (new MessageEvent('messageerror', {
  cancelable: false,
  data: error,
}));
