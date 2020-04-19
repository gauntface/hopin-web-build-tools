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

async function build(overrides, opts) {
  const config = getConfig(overrides);
  opts = Object.assign(defaultOpts, opts)

  const cssVarFiles = [];
  if (opts.cssVariablesDir) {
    const files = await fs.readdir(opts.cssVariablesDir);
    for (const f of files) {
      cssVarFiles.push(path.join(opts.cssVariablesDir, f))
    }
  }

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
      importFrom: cssVarFiles,
    }),
    cssnano({
      discardUnused: false,
    }),
  ];

  const renameopts = {};
  if (opts.extname) {
    renameopts.extname = opts.extname;
  }

  return new Promise(function (resolve, reject) {
    gulp.src([path.posix.join(config.src, '**', '*.css'), `!${path.posix.join(config.src, '**', '_*.css')}`])
      .pipe(
        postcss(processors).on('error', reject)
      )
      .pipe(rename(renameopts))
      .pipe(gulp.dest(config.dst))
      .on('end', resolve);
  });
}

function gulpBuild(overrides, opts) {
  const func = () => build(overrides, opts)
  func.displayName = `@hopin/wbt-css`;
  return func
}

module.exports = {
  build,
  gulpBuild,
};