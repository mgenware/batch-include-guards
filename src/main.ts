#!/usr/bin/env node
import globby from 'globby';
import { promises as fsPromises } from 'fs';
import slash from 'slash';

const args = process.argv.slice(2);
if (!args.length) {
  throw new Error('No input files');
}

async function addGuard(file: string) {
  const pathComponents = file.split('/').filter((s) => !s.startsWith('.'));
  const guardName = `${pathComponents
    .join('_')
    .toUpperCase()
    .replace('.', '_')}_`;

  const content = await fsPromises.readFile(file, 'utf8');
  const lines = content.split(/\r?\n/);
  let startIndex = 0;

  // Skip comments.
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimLeft();
    if (line && !line.startsWith('//')) {
      startIndex = i;
      break;
    }
  }

  // Push start lines.
  const isLastLineEmpty = startIndex && !lines[startIndex - 1];
  const startLines = isLastLineEmpty || !startIndex ? [] : [''];
  startLines.push(`#ifndef ${guardName}`);
  startLines.push(`#define ${guardName}`);
  startLines.push('');

  lines.splice(startIndex, 0, ...startLines);

  // Push end lines.
  lines.push('', `#endif // ${guardName}`, '');

  await fsPromises.writeFile(file, lines.join('\n'));
}

(async () => {
  const paths = await globby(args.map(slash));
  if (!paths.length) {
    // eslint-disable-next-line no-console
    console.log(`No matches found in glob ${JSON.stringify(args)}`);
  }
  await Promise.all(
    paths.map(async (p) => {
      await addGuard(p);
      // eslint-disable-next-line no-console
      console.log(`> ${p}`);
    }),
  );
})();
