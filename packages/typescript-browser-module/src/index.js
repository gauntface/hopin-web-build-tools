const {runTS, minifyJS} = require('@hopin/wbt-ts-shared');

async function build(subDir) {
  const report = await runTS(subDir, 'es2015');

  await minifyJS('browser');

  return report;
}

function gulpBuild(subDir) {
  const func = () => build(subDir)
  func.displayName = `@hopin/wbt-ts-browser`;
  return func
}

module.exports = {
  build,
  gulpBuild,
};