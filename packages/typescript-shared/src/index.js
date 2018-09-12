const {getConfig} = require('@hopin/wbt-config');
const {logger, spawn} = require('@hopin/wbt-common');
const path = require('path');
const rollup = require('rollup');
const sourcemapPlugin = require('rollup-plugin-sourcemaps');
const {terser} = require('rollup-plugin-terser');
const {promisify} = require('util');
const glob = promisify(require('glob'));

async function runTS(outputModule, overrides = {}) {
  const config = getConfig(overrides)

  // Get all files to build
  let globSrc = config.src;

  logger.debug(`TypeScript source : ${path.relative(process.cwd(), globSrc)}`);
  logger.debug(`TypeScript dest   : ${path.relative(process.cwd(), config.dst)}`);

  const globPattern = path.posix.join(globSrc, '**', '*.ts');
  const ignoreDefitionsPattern = path.posix.join(globSrc, '**', '*.d.ts');
  const ignoreUnderscorePrefixPattern = path.posix.join(globSrc, '**', '_*.ts');
  const srcFiles = await glob(globPattern, {
    strict: true,
    ignore: [ignoreDefitionsPattern, ignoreUnderscorePrefixPattern]
  });

  logger.log(`Building the following TypeScript files:`);
  srcFiles.forEach((file) => logger.log(`    ${path.relative(process.cwd(), file)}`));

  // require.resolve('typescript') returns the path to lib/typescript.js, so step back to get the typescript
  // module directory
  const tsModulePath = path.join(require.resolve('typescript'), '..', '..');
  const tsCompilerPath = path.join(tsModulePath, 'bin', 'tsc');
  logger.debug(`Using typescript compiler '${path.relative(process.cwd(), tsCompilerPath)}'`);

  let promiseChain = Promise.resolve();
  srcFiles.forEach(async (srcFile) => {
    promiseChain = promiseChain.then(async () => {
      const tscOptions = [
        '--declaration',
        '--target', 'es2017',
        '--module', outputModule,
        '--moduleResolution', 'node',
        '--noImplicitAny', 'true',
        '--removeComments', 'true',
        '--preserveConstEnums', 'true',
        '--sourceMap', 'true',
        '--rootDir', overrides.rootDir ? overrides.rootDir : config.src,
        '--outDir', config.dst,
      ];
  
      if (overrides.flags) {
        tscOptions.push(...overrides.flags);
      }
  
      tscOptions.push(srcFile);
      logger.debug(`Running command: 'tsc ${tscOptions.join(' ')}'`);
      const result = await spawn(tsCompilerPath, tscOptions);
      if (result.code != 0) {
        logger.warn(result.stdout.split('\\n').join('\n'))
        logger.warn(result.stderr.split('\\n').join('\n'))
      }
    }).catch((err) => {
      logger.error(`Unable to build '${srcFile}' with tsc.`);
      throw err
    });
  });

  await promiseChain;

  return {
    srcFiles,
  };
}

const minifyJS = async function(outputType, name, overrides = {}) {
  const config = getConfig(overrides);

  let format = null;
  switch (outputType) {
    case 'browser': {
      format = 'iife';
      if (!name) {
        throw new Error('You must provide a name for generatin browser bundle.');
      }
      break;
    }
    case 'node': {
      format = 'cjs';
      break;
    }
    default: {
      throw new Error(`Unknown minify output type: ${outputType}`);
    }
  }

  logger.debug(`Minify source : ${path.relative(process.cwd(), config.dst)}`);
  logger.debug(`Minify dest   : ${path.relative(process.cwd(), config.dst)}`);

  const globPattern = path.posix.join(config.dst, '**', '*.js');
  const ignoreUnderscorePrefixPattern = path.posix.join(config.dst, '**', '_*.js');
  const srcFiles = await glob(globPattern, {
    strict: true,
    ignore: [ignoreUnderscorePrefixPattern]
  });

  logger.debug(`Minifying the following JavaScript files for the browser:`);
  srcFiles.forEach((file) => logger.debug(`    ${path.relative(process.cwd(), file)}`));

  let promiseChain = Promise.resolve();
  srcFiles.forEach(async (srcFile) => {
    promiseChain = promiseChain.then(async () => {
      const plugins = [
        // This module enabled Rollup to *ingest* a sourcemap to apply
        // further manipulations
        sourcemapPlugin(),
        // Minify the bundled JS
        terser(),        
      ];

      if (overrides.rollupPlugins) {
        // Any additional plugins
        plugins.push(...overrides.rollupPlugins)
      }
      
      const inputOpts = {
        input: srcFile,
        plugins,
      };
      const outputOptions = {
        format,
        name,
        sourcemap: true,
        file: srcFile,
      };
      const bundle = await rollup.rollup(inputOpts);
  
      // or write the bundle to disk
      await bundle.write(outputOptions);
    }).catch((err) => {
      logger.error(`Unable to minify '${srcFile}' with rollup.`);
      throw err
    });
  });

  await promiseChain;

  return {
    srcFiles,
  };
}

module.exports = {
  runTS,
  minifyJS
};