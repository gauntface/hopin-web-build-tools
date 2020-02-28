const {getConfig} = require('@hopin/wbt-config');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const atImport = require('postcss-import');
const csspresetenv = require('postcss-preset-env');
const cssnano = require('cssnano');
const path = require('path');
const fs = require('fs-extra');

const defaultOpts = {
  preserve: true,
};

function build(overrides, opts) {
  const config = getConfig(overrides);
  opts = Object.assign(defaultOpts, opts)

  const processors = [
    atImport({
      resolve: async (id, basedir, importOptions) => {
        const pathsToCheck = [
          path.join(basedir, id),
        ];

        if (opts.importPaths && opts.importPaths.length > 0) {
          for (const p of opts.importPaths) {
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
      preserve: opts.preserve,
    }),
    cssnano({
      discardUnused: false,
    }),
  ];

  const renameopts = {};
  if (opts.preserve) {
    renameopts.extname = '.dev.css';
  } else {
    renameopts.extname = '.prod.css';
  }

  return new Promise(function (resolve, reject) {
    gulp.src(path.posix.join(config.src, '**', '*.css'))
      .pipe(
        postcss(processors).on('error', reject)
      )
      .pipe(rename(renameopts))
      .pipe(gulp.dest(config.dst))
      .on('end', resolve);
  });
}

function buildAll(overrides, opts) {
  return build(overrides, Object.assign({}, opts, {preserve: true}))
  .then(() => build(overrides, Object.assign({}, opts, {preserve: false})));
}

function gulpBuild(overrides, opts) {
  const func = () => build(overrides, opts)
  func.displayName = `@hopin/wbt-css`;
  return func
}

function gulpBuildAll(overrides, opts) {
  const func = () => buildAll(overrides, opts)
  func.displayName = `@hopin/wbt-css`;
  return func
}

module.exports = {
  build,
  buildAll,
  gulpBuild,
  gulpBuildAll,
};