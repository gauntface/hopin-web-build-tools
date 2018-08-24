const {runTS} = require('@hopin/wbt-ts-shared');

async function build(subDir) {
  const report = runTS(subDir, 'commonjs');

  // TODO: Minify output

  return report;
}

build.displayName = `@hopin/wbt-ts-node`;

module.exports = {
  build,
};