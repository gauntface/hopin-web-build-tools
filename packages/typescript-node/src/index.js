const {runTS, minifyJS} = require('@hopin/wbt-ts-shared');

async function build(subDir) {
  const report = await runTS(subDir, 'commonjs');

  await minifyJS('node');

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