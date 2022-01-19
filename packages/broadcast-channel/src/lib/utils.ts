/**
 * Copied from: https://stackoverflow.com/a/68141099/1099999
 */
export function uuidv4() {
  return '00-0-4-1-000'.replace(/[^-]/g,
    (s: any) => ((Math.random() + ~~s) * 0x10000 >> s).toString(16).padStart(4, '0')
  );
}

/**
 * Queue a new task in the event loop after the delay and let the thread deal with it as soon
 * as it's available for more work.
 *
 * See {@link https://stackoverflow.com/questions/9083594/call-settimeout-without-delay}
 *
 * @param fn - Task to defer
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function defer(fn: Function): void {
  setTimeout(fn, 0);
}
