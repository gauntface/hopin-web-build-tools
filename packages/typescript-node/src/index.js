const {runTS, minifyJS} = require('@hopin/wbt-ts-shared');
const hashbang = require('rollup-plugin-hashbang');
const {Logger} = require('@hopin/logger');

const logger = new Logger();
logger.setPrefix('[@hopin/wbt-ts-node]');

async function build(overrides = {}) {
  const report = await runTS(logger, 'commonjs', overrides);

  if (!overrides.rollupPlugins) {
    overrides.rollupPlugins = [];
  }
  overrides.rollupPlugins.push(hashbang());
  await minifyJS(logger, 'node', null, overrides);

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