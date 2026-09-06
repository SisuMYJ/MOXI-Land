import { rm, mkdir, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { build } from 'esbuild';

const outputDirectory = '.test-dist';
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
const entryPoints = (await readdir('tests'))
  .filter((file) => file.endsWith('.test.ts'))
  .map((file) => `tests/${file}`);

await build({
  entryPoints,
  outdir: outputDirectory,
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  sourcemap: 'inline',
});

const result = spawnSync(process.execPath, ['--test', ...entryPoints.map((file) => `${outputDirectory}/${file.replace(/^tests\//, '').replace(/\.ts$/, '.js')}`)], {
  stdio: 'inherit',
});
process.exit(result.status ?? 1);

