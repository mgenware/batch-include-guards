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
          'leaf.h': `#ifndef SRC_A_B_LEAF_H_
#define SRC_A_B_LEAF_H_

code

#endif // SRC_A_B_LEAF_H_
`,
        },
      },
      'root.h': `// comment

#ifndef SRC_ROOT_H_
#define SRC_ROOT_H_

code

#endif // SRC_ROOT_H_
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
          'leaf.h': `#ifndef A_B_LEAF_H_
#define A_B_LEAF_H_

code

#endif // A_B_LEAF_H_
`,
        },
      },
      'root.h': `// comment

#ifndef ROOT_H_
#define ROOT_H_

code

#endif // ROOT_H_
`,
    },
  });
});
