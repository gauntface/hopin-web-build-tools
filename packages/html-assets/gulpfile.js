const path = require('path');
const gulp = require('gulp');
const fs = require('fs-extra');
const tsNode = require('@hopin/wbt-ts-node'); 

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

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
  )
);