<h1  align="center">@hopin/wbt-*</h1>

<p align="center">
  <a href="https://travis-ci.org/gauntface/hopin-web-build-tools"><img src="https://travis-ci.org/gauntface/hopin-web-build-tools.svg?branch=master" alt="Travis Build Status" /></a>
  <a href="https://coveralls.io/github/gauntface/hopin-web-build-tools?branch=master"><img src="https://coveralls.io/repos/github/gauntface/hopin-web-build-tools/badge.svg?branch=master" alt="Coverage Status" /></a>
</p>

<p align="center">
`hopin-web-build-tools` is a set of build functions used for hopin web projects.
</p>


<p align="center">
<img alt="Simpsons Build" src="https://media.giphy.com/media/xT5LMsbnMnCR0DjeE0/giphy.gif" />
</p>

## @hopin/wbt-ts-node

<p align=center>
  <a href="https://david-dm.org/gauntface/@hopin/wbt-ts-node" title="dependencies status"><img src="https://david-dm.org/gauntface/@hopin/wbt-ts-node/status.svg"/></a>
  <a href="https://david-dm.org/gauntface/@hopin/wbt-ts-node?type=dev" title="devDependencies status"><img src="https://david-dm.org/gauntface/@hopin/wbt-ts-node/dev-status.svg"/></a>
  <a href="https://david-dm.org/gauntface/@hopin/wbt-ts-node?type=peer" title="peerDependencies status"><img src="https://david-dm.org/gauntface/@hopin/wbt-ts-node/peer-status.svg"/></a>
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
  <a href="https://david-dm.org/gauntface/@hopin/wbt-ts-browser" title="dependencies status"><img src="https://david-dm.org/gauntface/@hopin/wbt-ts-browser/status.svg"/></a>
  <a href="https://david-dm.org/gauntface/@hopin/wbt-ts-browser?type=dev" title="devDependencies status"><img src="https://david-dm.org/gauntface/@hopin/wbt-ts-browser/dev-status.svg"/></a>
  <a href="https://david-dm.org/gauntface/@hopin/wbt-ts-browser?type=peer" title="peerDependencies status"><img src="https://david-dm.org/gauntface/@hopin/wbt-ts-browser/peer-status.svg"/></a>
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
    tsBrowser.gulpBuild()
  )
);
```

## @hopin/wbt-css

<p align=center>
  <a href="https://david-dm.org/gauntface/@hopin/wbt-css" title="dependencies status"><img src="https://david-dm.org/gauntface/@hopin/wbt-css/status.svg"/></a>
  <a href="https://david-dm.org/gauntface/@hopin/wbt-css?type=dev" title="devDependencies status"><img src="https://david-dm.org/gauntface/@hopin/wbt-css/dev-status.svg"/></a>
  <a href="https://david-dm.org/gauntface/@hopin/wbt-css?type=peer" title="peerDependencies status"><img src="https://david-dm.org/gauntface/@hopin/wbt-css/peer-status.svg"/></a>
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