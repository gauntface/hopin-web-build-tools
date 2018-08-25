const {runTS} = require('@hopin/wbt-ts-shared');

async function build(subDir) {
  const report = runTS(subDir, 'commonjs');

  // TODO: Minify output

  return report;
}

function gulpBuild(subDir) {
  const func = () => build(subDir)
  func.displayName = `@hopin/wbt-ts-node`;
  return func
}

module.exports = {
  build,
  gulpBuild,
};