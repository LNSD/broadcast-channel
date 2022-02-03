/**
 * See: https://playwright.dev/docs/test-cli#reference
 */
import { CommandOptions, runCommand } from "./util";


export interface TestOptions {
  headed?: boolean;
  browser?: string;
  debug?: boolean;
  config: string;
  grep?: string;
  grepInvert?: string;
  reporter?: string;
  output: string;
  workers?: number;
}

function toCliArgs(options: TestOptions): string[] {
  const cliOptions: string[] = [];

  if (options?.headed) {
    cliOptions.push("--headed");
  }

  if (options?.browser) {
    cliOptions.push("--browser", options.browser);
  }

  if (options?.debug) {
    cliOptions.push("--debug");
  }

  cliOptions.push("--config", options.config);

  if (options?.grep) {
    cliOptions.push("--grep", options.grep);
  }

  if (options?.grepInvert) {
    cliOptions.push("--grep-invert", options.grepInvert);
  }

  if (options?.reporter) {
    cliOptions.push("--reporter", options.reporter);
  }

  cliOptions.push("--output", options.output);

  if (options?.workers) {
    cliOptions.push("--workers", String(options.workers));
  }

  return cliOptions;
}

export const buildTestCommand = (options: TestOptions, ...files: string[]) => async (cmdOptions: CommandOptions): Promise<{ success: boolean }> => {
  return runCommand("npx", ["playwright", "test", ...toCliArgs(options), ...files], cmdOptions);
}
