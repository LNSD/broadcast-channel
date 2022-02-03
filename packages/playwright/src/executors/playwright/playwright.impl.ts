import { dirname, basename } from 'path';
import { ExecutorContext, logger, parseTargetString, readTargetOptions, runExecutor } from '@nrwl/devkit';
import { buildTestCommand, TestOptions } from './cli/test';

export interface PlaywrightExecutorOptions extends Record<string, any> {
  playwrightConfig: string;
  outputDir: string;
  devServerTarget?: string;
  headed?: boolean;
  record?: boolean;
  parallel?: boolean;
  browser?: string;
  debug?: boolean;
  env?: Record<string, string>;
  spec?: string;
  ignoreTestFiles?: string;
  reporter?: string;
  reporterOptions?: string;
  skipServe?: boolean;
  tag?: string;
}

function toTestOptions(options: PlaywrightExecutorOptions): TestOptions {
  const testOptions: TestOptions = {
    config: basename(options.playwrightConfig),
    output: options.outputDir,
  };

  testOptions.headed = options.headed;
  testOptions.browser = options.browser;
  testOptions.debug = options.debug;
  testOptions.reporter = options.reporter;
  if (options.parallel === false) {
    testOptions.workers = 1;
  }

  return testOptions;
}

async function* startDevServer(options: PlaywrightExecutorOptions, context: ExecutorContext) {
  // no dev server, return the provisioned base url
  if (!options.devServerTarget || options.skipServe) {
    yield options.baseUrl;
    return;
  }

  const { project, target, configuration } = parseTargetString(options.devServerTarget);
  const devServerTargetOpts = readTargetOptions({ project, target, configuration }, context);
  const targetSupportsWatchOpt = Object.keys(devServerTargetOpts).includes('watch');

  for await (const output of await runExecutor<{ success: boolean; baseUrl?: string; }>(
    { project, target, configuration },
    // @NOTE: Do not forward watch option if not supported by the target dev server,
    // this is relevant for running Cypress against dev server target that does not support this option,
    // for instance @nguniversal/builders:ssr-dev-server.
    targetSupportsWatchOpt ? { watch: options.watch } : {},
    context,
  )) {
    if (!output.success && !options.watch) {
      throw new Error('Could not compile application files');
    }

    yield options.baseUrl || (output.baseUrl as string);
  }
}

async function runPlaywrightTests(baseUrl: string, options: PlaywrightExecutorOptions) {
  // Playwright expects the folder where a config file is present
  const projectFolderPath = dirname(options.playwrightConfig);
  // const opts: any = {
  //   project: projectFolderPath,
  //   configFile: path.basename(options.playwrightConfig),
  // };

  const testOptions = toTestOptions(options);
  const runCmd = buildTestCommand(testOptions, 'src');

  const result = await runCmd({
    cwd: projectFolderPath,
    env: options.env,
    onstdout: logger.log,
    onstderr: logger.error,
  });

  return result.success;
}


// Executor

export default async function cypressExecutor(
  options: PlaywrightExecutorOptions,
  context: ExecutorContext,
) {
  let success;
  for await (const baseUrl of startDevServer(options, context)) {
    try {
      success = await runPlaywrightTests(baseUrl, options);
      if (!options.watch) break;
    } catch (e) {
      logger.error(e.message);
      success = false;
      if (!options.watch) break;
    }
  }

  return { success };
}

