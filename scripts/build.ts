import { build as esbuild } from 'esbuild';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { entries, outputBaseName } from './entries';

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const rimraf = (target: string): void => {
  fs.rmSync(target, { recursive: true, force: true });
};

/**
 * Emit a single entry in one module format.
 *
 * We author plain ES modules in `src/*` (`export const x = ...; export default x;`)
 * and let esbuild carry both the named and the default export through to every
 * output format. No UMD wrapper and no global-assignment fallback branch is emitted.
 */
const bundleEntry = async (source: string, outfile: string, format: 'esm' | 'cjs'): Promise<void> => {
  await esbuild({
    entryPoints: [source],
    outfile,
    format,
    platform: 'neutral',
    target: 'es2016',
    bundle: true,
    minify: true,
    sourcemap: false,
    legalComments: 'none',
  });
};

const run = async (): Promise<void> => {
  rimraf(distDir);
  fs.mkdirSync(distDir, { recursive: true });

  // 1..3: three esbuild passes per entry (ESM -> .mjs, CJS -> .cjs, CJS -> .js).
  //       The extra .js pass is the backward-compat clean-CJS output that keeps
  //       already-published `.js` resolvers working after consumers upgrade.
  for (const { name, source } of entries) {
    const base = outputBaseName(name);

    await bundleEntry(source, path.join(distDir, `${base}.mjs`), 'esm');
    await bundleEntry(source, path.join(distDir, `${base}.cjs`), 'cjs');
    await bundleEntry(source, path.join(distDir, `${base}.js`), 'cjs');
  }

  // 4: TypeScript declarations only, emitted straight into dist/.
  emitDeclarations();

  // eslint-disable-next-line no-console
  console.log(`Build complete. Artifacts written to ${path.relative(rootDir, distDir)}/`);
};

const emitDeclarations = (): void => {
  const tsc = path.join(rootDir, 'node_modules', '.bin', 'tsc');

  execFileSync(
    tsc,
    [
      '-p',
      'tsconfig.json',
      '--emitDeclarationOnly',
      '--declaration',
      '--outDir',
      'dist',
      '--declarationDir',
      'dist',
    ],
    { cwd: rootDir, stdio: 'inherit' },
  );

  // tsc emits `index.d.ts` for the root entry; the JS output is `bundle.*`,
  // so mirror the declaration file name to match the exports map.
  const indexDts = path.join(distDir, 'index.d.ts');
  const bundleDts = path.join(distDir, 'bundle.d.ts');
  if (fs.existsSync(indexDts)) {
    fs.copyFileSync(indexDts, bundleDts);
  }
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
