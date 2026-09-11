import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Interop regression guard.
 *
 * Packs the real tarball from dist/, installs it into a throwaway project, and
 * probes a representative subpath (isNil) plus the root under three resolvers:
 *   - tsx (esbuild)
 *   - Node native ESM
 *   - Node CJS
 *
 * Asserts default imports are callable, named + default exports are both present,
 * and the ESM namespace has NO phantom keys (module.exports / package name). Exits
 * non-zero on any violation so the UMD interop defect cannot silently return.
 */

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const PKG = 'json-storage-formatter';

const PHANTOM_KEYS = ['module.exports', PKG, '__esModule'];

const log = (message: string): void => {
  // eslint-disable-next-line no-console
  console.log(message);
};

const fail = (message: string): never => {
  // eslint-disable-next-line no-console
  console.error(`\u274c ${message}`);
  process.exit(1);
};

const run = (): void => {
  if (!fs.existsSync(path.join(distDir, 'package.json'))) {
    fail('dist/package.json not found. Run `yarn build` before the interop test.');
  }

  // 1. Pack the staged package from dist/.
  const packOutput = execFileSync('npm', ['pack', '--json'], { cwd: distDir, encoding: 'utf8' });
  const tarballName = (JSON.parse(packOutput) as Array<{ filename: string }>)[0].filename;
  const tarballPath = path.join(distDir, tarballName);
  log(`Packed ${tarballName}`);

  // 2. Install the tarball into a throwaway project (no --legacy-peer-deps).
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsf-interop-'));

  try {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      `${JSON.stringify({ name: 'jsf-interop-consumer', version: '1.0.0', private: true }, null, 2)}\n`,
    );

    log(`Installing tarball into ${tmpDir}`);
    execFileSync('npm', ['install', tarballPath], { cwd: tmpDir, stdio: 'inherit' });

    probeTsx(tmpDir);
    probeNodeEsm(tmpDir);
    probeNodeCjs(tmpDir);

    log('\n\u2705 All interop probes passed.');
  } finally {
    fs.rmSync(tarballPath, { force: true });
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
};

/** tsx / esbuild resolver — default import must be callable, namespace clean. */
const probeTsx = (cwd: string): void => {
  log('\n--- tsx (esbuild) ---');

  const script = `
import isNil from '${PKG}/isNil';
import * as ns from '${PKG}/isNil';
import root, * as rootNs from '${PKG}';

const out = {
  isNilType: typeof isNil,
  nsKeys: Object.keys(ns).sort(),
  callNull: isNil(null),
  callZero: isNil(0),
  rootDefaultType: typeof root,
  rootIsNilType: typeof rootNs.isNil,
};
console.log(JSON.stringify(out));
`;

  const result = runNodeScript(cwd, script, ['tsx'], 'ts');

  assert(result.isNilType === 'function', `tsx: default isNil must be a function, got ${result.isNilType}`);
  assertKeys(result.nsKeys as string[], 'tsx');
  assert(result.callNull === true, 'tsx: isNil(null) must be true');
  assert(result.callZero === false, 'tsx: isNil(0) must be false');
  assert(result.rootDefaultType === 'object', 'tsx: root default import must be an object');
  assert(result.rootIsNilType === 'function', 'tsx: root named isNil must be a function');

  log('tsx probe OK');
};

/** Node native ESM — default import bound to the function, not a wrapper object. */
const probeNodeEsm = (cwd: string): void => {
  log('\n--- Node ESM ---');

  const script = `
import isNil from '${PKG}/isNil';
import * as ns from '${PKG}/isNil';
const out = {
  isNilType: typeof isNil,
  nsKeys: Object.keys(ns).sort(),
  callNull: isNil(null),
};
console.log(JSON.stringify(out));
`;

  const result = runNodeScript(cwd, script, ['node'], 'mjs');

  assert(result.isNilType === 'function', `Node ESM: default isNil must be a function, got ${result.isNilType}`);
  assertKeys(result.nsKeys as string[], 'Node ESM');
  assert(result.callNull === true, 'Node ESM: isNil(null) must be true');

  log('Node ESM probe OK');
};

/** Node CJS — require returns { isNil, default, __esModule }, all real. */
const probeNodeCjs = (cwd: string): void => {
  log('\n--- Node CJS ---');

  const script = `
const m = require('${PKG}/isNil');
const out = {
  defaultType: typeof m.default,
  isNilType: typeof m.isNil,
  esModule: m.__esModule,
  callDefault: m.default(null),
  callNamed: m.isNil(0),
};
console.log(JSON.stringify(out));
`;

  const result = runNodeScript(cwd, script, ['node'], 'cjs');

  assert(result.defaultType === 'function', `Node CJS: m.default must be a function, got ${result.defaultType}`);
  assert(result.isNilType === 'function', `Node CJS: m.isNil must be a function, got ${result.isNilType}`);
  assert(result.esModule === true, 'Node CJS: __esModule must be true');
  assert(result.callDefault === true, 'Node CJS: m.default(null) must be true');
  assert(result.callNamed === false, 'Node CJS: m.isNil(0) must be false');

  log('Node CJS probe OK');
};

const runNodeScript = (
  cwd: string,
  script: string,
  runner: string[],
  ext: 'ts' | 'mjs' | 'cjs',
): Record<string, unknown> => {
  const file = path.join(cwd, `probe.${ext}`);
  fs.writeFileSync(file, script);

  try {
    const [cmd, ...preArgs] = resolveRunner(cwd, runner);
    const stdout = execFileSync(cmd, [...preArgs, file], { cwd, encoding: 'utf8' });
    const line = stdout.trim().split('\n').filter(Boolean).pop() ?? '{}';
    return JSON.parse(line) as Record<string, unknown>;
  } finally {
    fs.rmSync(file, { force: true });
  }
};

/** tsx is resolved from this repo's node_modules; node comes from PATH. */
const resolveRunner = (_cwd: string, runner: string[]): string[] => {
  if (runner[0] === 'tsx') {
    const bin = path.join(rootDir, 'node_modules', '.bin', 'tsx');
    return [bin];
  }
  return runner;
};

const assert = (condition: boolean, message: string): void => {
  if (!condition) fail(message);
};

const assertKeys = (keys: string[], label: string): void => {
  const phantom = keys.filter((k) => PHANTOM_KEYS.includes(k));
  if (phantom.length > 0) {
    fail(`${label}: namespace contains phantom keys: ${JSON.stringify(phantom)}`);
  }

  const hasNamed = keys.includes('isNil');
  const hasDefault = keys.includes('default');
  if (!hasNamed || !hasDefault) {
    fail(`${label}: namespace must include both 'isNil' and 'default', got ${JSON.stringify(keys)}`);
  }
};

run();
