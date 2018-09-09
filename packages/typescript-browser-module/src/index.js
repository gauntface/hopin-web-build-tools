const {runTS, minifyJS} = require('@hopin/wbt-ts-shared');

async function build(name, subDir) {
  const report = await runTS(subDir, 'es2015');

  await minifyJS('browser', name);

  return report;
}

function gulpBuild(name, subDir) {
  const func = () => build(name, subDir)
  func.displayName = `@hopin/wbt-ts-browser`;
  return func
}

module.exports = {
  build,
  gulpBuild,
};