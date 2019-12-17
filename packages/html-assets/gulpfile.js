const path = require('path');
const gulp = require('gulp');
const fs = require('fs-extra');
const tsNode = require('@hopin/wbt-ts-node');
const tsBrowser = require('@hopin/wbt-ts-browser');

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');
const browserAssetsDir = 'browser-assets';

gulp.task('clean', () => {
    return fs.remove(dst);
});

gulp.task('build',
  gulp.series(
    'clean',
    tsNode.gulpBuild({
        src: src,
        dst: dst,
    }),
    tsBrowser.gulpBuild('hopin.htmlassets', {
      src: path.join(__dirname, browserAssetsDir),
      dst: path.join(dst, browserAssetsDir),
      sourcemap: false,
    }),
  ),
);