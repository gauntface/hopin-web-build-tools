const {promisify} = require('util');
const path = require('path');

const {getConfig, logger, spawn} = require('@hopin/wbt-config');
const glob = promisify(require('glob'));

async function build() {
  const config = getConfig()

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

  logger.debug(`Building the following TypeScript files for node:`);
  srcFiles.forEach((file) => logger.debug(`    ${path.relative(process.cwd(), file)}`));

  // require.resolve('typescript') returns the path to lib/typescript.js, so step back to get the typescript
  // module directory
  const tsModulePath = path.join(require.resolve('typescript'), '..', '..');
  const tsCompilerPath = path.join(tsModulePath, 'bin', 'tsc');
  logger.debug(`Using typescript compiler '${path.relative(process.cwd(), tsCompilerPath)}'`);


  //
  // TODO: Run over all files.
  //


  // Build files with tsc -p ./tsconfig.json --declaration --rootDir ?? --outDir ?? <src_file>
  const tscOptions = [
    '--declaration',
    '--target', 'es2017',
    '--module', 'commonjs',
    '--noImplicitAny', 'true',
    '--removeComments', 'true',
    '--preserveConstEnums', 'true',
    '--sourceMap', 'true',
    '--rootDir', config.src,
    '--outDir', config.dst,
    srcFiles[0],
  ]
  logger.debug(`Running command: 'tsc ${tscOptions.join(' ')}'`);
  const result = await spawn(tsCompilerPath, tscOptions);
  console.log(result.stdout.split('\\n').join('\n'))
  console.log(result.stderr.split('\\n').join('\n'))
}

module.exports = {
  build,
};