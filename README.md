# batch-include-guards

Add header include guards to files in bulk.

## Usage

- Go to the root directory of your project.
- Use a glob to filter out the files to be added with include guards.

Example:

```sh
cd <project_root>

# Batch add include guards for all header files in `/a/b/`.
npx batch-include-guards "./a/b/**/*.h"
```

Before:

```cpp
code
```

After:

```cpp
#ifndef A_B_FILENAME_H
#define A_B_FILENAME_H

code

#endif // A_B_FILENAME_H
```
