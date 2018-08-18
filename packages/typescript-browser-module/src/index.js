const {promisify} = require('util');
const path = require('path');

const {logger, spawn} = require('@hopin/wbt-common');
const {getConfig} = require('@hopin/wbt-config');
const glob = promisify(require('glob'));

async function build(srcDir, dstDir) {
  const config = getConfig()

  if (srcDir) {
    config.src = srcDir
  }

  if (dstDir) {
    config.dst = dstDir
  }

  logger.debug(`TypeScript source : ${path.relative(process.cwd(), config.src)}`);
  logger.debug(`TypeScript dest   : ${path.relative(process.cwd(), config.dst)}`);

  // Get all files to build
  const globPattern = path.posix.join(config.src, '**', '*.ts');
  const ignoreDefitionsPattern = path.posix.join(config.src, '**', '*.d.ts');
  const ignoreUnderscorePrefixPattern = path.posix.join(config.src, '**', '_*.ts');
  const srcFiles = await glob(globPattern, {
    strict: true,
    ignore: [ignoreDefitionsPattern, ignoreUnderscorePrefixPattern]
  });

  logger.debug(`Building the following TypeScript files for browser:`);
  srcFiles.forEach((file) => logger.debug(`    ${path.relative(process.cwd(), file)}`));

  // require.resolve('typescript') returns the path to lib/typescript.js, so step back to get the typescript
  // module directory
  const tsModulePath = path.join(require.resolve('typescript'), '..', '..');
  const tsCompilerPath = path.join(tsModulePath, 'bin', 'tsc');
  logger.debug(`Using typescript compiler '${path.relative(process.cwd(), tsCompilerPath)}'`);

  const buildPromises = srcFiles.map(async (srcFile) => {
    const tscOptions = [
      '--declaration',
      '--target', 'es2017',
      '--module', 'es2015',
      '--moduleResolution', 'node',
      '--noImplicitAny', 'true',
      '--removeComments', 'true',
      '--preserveConstEnums', 'true',
      '--sourceMap', 'true',
      '--rootDir', config.src,
      '--outDir', config.dst,
      srcFile,
    ]
    logger.debug(`Running command: 'tsc ${tscOptions.join(' ')}'`);
    const result = await spawn(tsCompilerPath, tscOptions);
    if (result.code != 0) {
      logger.warn(result.stdout.split('\\n').join('\n'))
      logger.warn(result.stderr.split('\\n').join('\n'))
    }
  });

  await Promise.all(buildPromises);

  return {
    srcFiles,
  };
}

module.exports = {
  build,
};