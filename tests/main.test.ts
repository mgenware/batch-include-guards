import * as assert from 'assert';
import copyToTmp from 'copy-dir-to-tmp';
import { execSync } from 'child_process';
import dirToObj from 'dir-contents-object';
import * as nodepath from 'path';

it('Relative to root', async () => {
  const newDir = await copyToTmp('./tests/data');
  execSync(`node ${nodepath.join(__dirname, '../dist/main.js')} "./**/*.h"`, {
    cwd: newDir,
  });
  assert.deepEqual(await dirToObj(newDir), {
    src: {
      a: {
        b: {
          'leaf.h': `#ifndef SRC_A_B_LEAF_H
#define SRC_A_B_LEAF_H

code

#endif // SRC_A_B_LEAF_H
`,
        },
      },
      'root.h': `// comment

#ifndef SRC_ROOT_H
#define SRC_ROOT_H

code

#endif // SRC_ROOT_H
`,
    },
  });
});

it('Relative to src', async () => {
  const newDir = await copyToTmp('./tests/data');
  execSync(`node ${nodepath.join(__dirname, '../dist/main.js')} "./**/*.h"`, {
    cwd: nodepath.join(newDir, 'src'),
  });
  assert.deepEqual(await dirToObj(newDir), {
    src: {
      a: {
        b: {
          'leaf.h': `#ifndef A_B_LEAF_H
#define A_B_LEAF_H

code

#endif // A_B_LEAF_H
`,
        },
      },
      'root.h': `// comment

#ifndef ROOT_H
#define ROOT_H

code

#endif // ROOT_H
`,
    },
  });
});
