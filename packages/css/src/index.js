const {getConfig} = require('@hopin/wbt-config');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
const csspresetenv = require('postcss-preset-env');
const cssnano = require('cssnano');
const path = require('path');
const gulpStreamToPromise = require('gulp-stream-to-promise');
const fs = require('fs-extra');

function build(overrides, importPaths) {
  const config = getConfig(overrides);

  const processors = [
    atImport({
      resolve: async (id, basedir, importOptions) => {
        const pathsToCheck = [
          path.join(basedir, id),
        ];

        if (importPaths && importPaths.length > 0) {
          for (const p of importPaths) {
            pathsToCheck.push(path.join(p, id));
          }
        }

        for (const p of pathsToCheck) {
          try {
            await fs.access(p);
            return p;
          } catch (err) {
            // NOOP
          }
        }
        throw new Error(`Unable to find import '${id}'`);
      }
    }),
    csspresetenv({
      warnForDuplicates: false,
    }),
    cssnano({
      discardUnused: false,
    }),
  ];

  return new Promise(function (resolve, reject) {
    gulp.src(path.posix.join(config.src, '**', '*.css'))
      .pipe(
        postcss(processors).on('error', reject)
      )
      .pipe(gulp.dest(config.dst))
      .on('end', resolve);
  });
}

function gulpBuild(overrides, importPaths) {
  const func = () => build(overrides, importPaths)
  func.displayName = `@hopin/wbt-css`;
  return func
}

module.exports = {
  build,
  gulpBuild,
};