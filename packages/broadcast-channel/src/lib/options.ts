import { ChannelFactory, LocalStorageOptions } from './channel';

export type Options = Partial<{
  backend: ChannelFactory;
  options: Partial<{ localstorage: LocalStorageOptions }> & Partial<{ [channelOptionsKey: string]: Record<string, any>; }>;
}>;
