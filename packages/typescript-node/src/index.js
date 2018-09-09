const {runTS, minifyJS} = require('@hopin/wbt-ts-shared');

async function build(overrides) {
  const report = await runTS('commonjs', overrides);

  await minifyJS('node', null, overrides);

  return report;
}

function gulpBuild(overrides) {
  const func = () => build(overrides)
  func.displayName = `@hopin/wbt-ts-node`;
  return func
}

module.exports = {
  build,
  gulpBuild,
};