const {runTS, minifyJS} = require('@hopin/wbt-ts-shared');
const hashbang = require('rollup-plugin-hashbang');

async function build(overrides = {}) {
  const report = await runTS('commonjs', overrides);

  if (!overrides.rollupPlugins) {
    overrides.rollupPlugins = [];
  }
  overrides.rollupPlugins.push(hashbang());
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