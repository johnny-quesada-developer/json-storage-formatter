import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

/**
 * Stage the publishable package inside dist/.
 *
 * The package.json exports paths (e.g. "./isNil.mjs") are relative, so they
 * resolve correctly next to the emitted files once package.json sits in dist/.
 * devDependencies and scripts are stripped from the copy; nothing consumers
 * install needs them. README and LICENSE are copied alongside.
 */
const run = (): void => {
  if (!fs.existsSync(distDir)) {
    throw new Error(`dist/ not found at ${distDir}. Run the build first.`);
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')) as Record<
    string,
    unknown
  >;

  delete pkg.devDependencies;
  delete pkg.scripts;

  fs.writeFileSync(path.join(distDir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

  for (const file of ['README.md', 'LICENSE']) {
    const source = path.join(rootDir, file);
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, path.join(distDir, file));
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Staged package.json, README.md and LICENSE into ${path.relative(rootDir, distDir)}/`);
};

run();
