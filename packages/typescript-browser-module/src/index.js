const {runTS, minifyJS} = require('@hopin/wbt-ts-shared');

async function build(name, overrides) {
  // TODO: Build this to temp
  const report = await runTS('es2015', overrides);

  // TODO: Build this to dst
  await minifyJS('browser', name);

  return report;
}

function gulpBuild(name, overrides) {
  const func = () => build(name, overrides)
  func.displayName = `@hopin/wbt-ts-browser`;
  return func
}

module.exports = {
  build,
  gulpBuild,
};