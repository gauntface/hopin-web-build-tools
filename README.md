<h1  align="center">@hopin/wbt-*</h1>

<p align="center">
  <img src="https://github.com/gauntface/hopin-web-build-tools/workflows/Build%20and%20Publish/badge.svg" alt="Build and Publish Status" />
  <a href="https://coveralls.io/github/gauntface/hopin-web-build-tools?branch=master"><img src="https://img.shields.io/coveralls/github/gauntface/hopin-web-build-tools.svg" alt="Coverage Status" /></a>
</p>

<p align="center">
`hopin-web-build-tools` is a set of build functions used for hopin web projects.
</p>


<p align="center">
<img alt="Simpsons Build" src="https://media.giphy.com/media/xT5LMsbnMnCR0DjeE0/giphy.gif" />
</p>

## @hopin/wbt-ts-node

<p align=center>
  <a href="https://david-dm.org/gauntface/hopin-web-build-tools?path=packages/typescript-node" title="dependencies status"><img src="https://david-dm.org/gauntface/hopin-web-build-tools/status.svg?path=packages/typescript-node"/></a>
  <a href="https://david-dm.org/gauntface/hopin-web-build-tools?path=packages/typescript-node&type=dev" title="devDependencies status"><img src="https://david-dm.org/gauntface/hopin-web-build-tools/dev-status.svg?path=packages/typescript-node"/></a>
  <a href="https://david-dm.org/gauntface/hopin-web-build-tools?path=packages/typescript-node&type=peer" title="peerDependencies status"><img src="https://david-dm.org/gauntface/hopin-web-build-tools/peer-status.svg?path=packages/typescript-node"/></a>
</p>

Convert typescript to a node friendly JS file (with minification).

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
    tsNode.gulpBuild()
  )
);
```

## @hopin/wbt-ts-browser

<p align=center>
  <a href="https://david-dm.org/gauntface/hopin-web-build-tools?path=packages/typescript-browser-module" title="dependencies status"><img src="https://david-dm.org/gauntface/hopin-web-build-tools/status.svg?path=packages/typescript-browser-module"/></a>
  <a href="https://david-dm.org/gauntface/hopin-web-build-tools?path=packages/typescript-browser-module&type=dev" title="devDependencies status"><img src="https://david-dm.org/gauntface/hopin-web-build-tools/dev-status.svg?path=packages/typescript-browser-module"/></a>
  <a href="https://david-dm.org/gauntface/hopin-web-build-tools?path=packages/typescript-browser-module&type=peer" title="peerDependencies status"><img src="https://david-dm.org/gauntface/hopin-web-build-tools/peer-status.svg?path=packages/typescript-browser-module"/></a>
</p>

Convert typescript to a browser friendly JS file (with minification).

### Install

```
npm install --save-dev @hopin/wbt-ts-browser
```

### Usage

```
const path = require('path');
const gulp = require('gulp');
const {setConfig} = require('@hopin/wbt-config');
const tsBrowser = require('@hopin/wbt-ts-browser'); 

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

setConfig(src, dst);

gulp.task('build',
  gulp.series(
    'clean',
    tsBrowser.gulpBuild(// TODO: Add a browser library name)
  )
);
```

If using node modules, you'll want to include the rollup plugins to bundle the modules into your library:

```javascript
gulp.task('build',
  gulp.series(
    'clean',
    tsBrowser.gulpBuild(// TODO: Add a browser library name, {
        rollupPlugins: [
          commonjs(),
          resolve({
            browser: true,
          }),
        ],
      })
  )
);
```

## @hopin/wbt-css

<p align=center>
  <a href="https://david-dm.org/gauntface/hopin-web-build-tools?path=packages/css" title="dependencies status"><img src="https://david-dm.org/gauntface/hopin-web-build-tools/status.svg?path=packages/css"/></a>
  <a href="https://david-dm.org/gauntface/hopin-web-build-tools?path=packages/css&type=dev" title="devDependencies status"><img src="https://david-dm.org/gauntface/hopin-web-build-tools/dev-status.svg?path=packages/css"/></a>
  <a href="https://david-dm.org/gauntface/hopin-web-build-tools?path=packages/css&type=peer" title="peerDependencies status"><img src="https://david-dm.org/gauntface/hopin-web-build-tools/peer-status.svg?path=packages/css"/></a>
</p>

Convert modern CSS to an older, optimised CSS file (with minification).

### Install

```
npm install --save-dev @hopin/wbt-css
```

### Usage

```
const path = require('path');
const gulp = require('gulp');
const {setConfig} = require('@hopin/wbt-config');
const css = require('@hopin/wbt-css'); 

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

setConfig(src, dst);

gulp.task('build',
  gulp.series(
    'clean',
    css.gulpBuild()
  )
);
```

## @hopin/wbt-html-assets

Inject CSS and JS required to render a page based on the HTML tags, attributes and classnames used.

### Install

```
npm install --save-dev @hopin/wbt-html-assets
```

### Usage

```
const path = require('path');
const gulp = require('gulp');
const html = require('@hopin/wbt-html-assets'); 

const htmlDir = path.join(__dirname, 'build');
const cssAndJSDir = path.join(__dirname, 'build');

gulp.task('build',
  gulp.series(
    html.gulpProcessFiles(htmlDir, cssAndJSDir),
  )
);
```

## @hopin/wbt-clean

Easily delete one or more directories.

### Install

```
npm install --save-dev @hopin/wbt-clean
```

### Usage

```
const path = require('path');
const gulp = require('gulp');
const clean = require('@hopin/wbt-clean'); 

const htmlDir = path.join(__dirname, 'build');
const cssAndJSDir = path.join(__dirname, 'build');

gulp.task('build',
  gulp.series(
    clean.gulpClean([htmlDir, cssAndJSDir]),
  )
);
```
