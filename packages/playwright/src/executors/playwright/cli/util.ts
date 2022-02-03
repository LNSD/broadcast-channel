import { spawn } from 'child_process';

export type Env = Record<string, string>;

export interface CommandOptions {
  env?: Env;
  cwd?: string;
  onstdout?: (log: string) => void;  // TODO: Review this
  onstderr?: (log: string) => void; // TODO: Review this
}

export async function runCommand(cmd: string, args?: string[], options?: CommandOptions): Promise<{ success: boolean }> {
  return new Promise<{ success: boolean }>((resolve, reject) => {
    const process = spawn(cmd, args, { env: options.env, cwd: options.cwd });
    process.on('error', reject);
    process.on('exit', (code: number) => {
      resolve({ success: code === 0 });
    });

    if (options?.onstdout) {
      process.stdout.on('data', data => options.onstdout(data.toString().trim()));
    }
    if (options?.onstderr) {
      process.stderr.on('data', data => options.onstderr(data.toString().trim()));
    }
  });
}
