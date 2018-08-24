# hopin-web-build-tools
A set of build functions / tools used for hopin web projects

## @hopin/wbt-ts-node

Convert typescript to a node friendly JS file.

### Install

```
npm install --save-dev @hopin/wbt-ts-node
```

### Usage

```
const path = require('path');
const gulp = require('gulp');
const {setConfig} = require('@hopin/wbt-config');
const tsNode = require('@hopin/wbt-ts-node'); 

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

setConfig(src, dst);

gulp.task('build',
  gulp.series(
    'clean',
    () => tsNode.build()
  )
);
```