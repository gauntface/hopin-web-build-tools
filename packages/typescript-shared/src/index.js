function runTS() {
    const config = getConfig()

  // Get all files to build
  let globSrc = config.src;
  if (subDir) {
    globSrc = path.join(config.src, subDir);
  }

  logger.debug(`TypeScript source : ${path.relative(process.cwd(), globSrc)}`);
  logger.debug(`TypeScript dest   : ${path.relative(process.cwd(), config.dst)}`);

  const globPattern = path.posix.join(globSrc, '**', '*.ts');
  const ignoreDefitionsPattern = path.posix.join(globSrc, '**', '*.d.ts');
  const ignoreUnderscorePrefixPattern = path.posix.join(globSrc, '**', '_*.ts');
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

  const buildPromises = srcFiles.map(async (srcFile) => {
    const tscOptions = [
      '--declaration',
      '--target', 'es2017',
      '--module', 'commonjs',
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

  // TODO: Minify output

  return {
    srcFiles,
  };
}