const {runTS} = require('@hopin/wbt-ts-shared');
const {Logger} = require('@hopin/logger');

const {minifyJS} = require('./minify');

const logger = new Logger();
logger.setPrefix('[@hopin/wbt-ts-js-mod]');

async function build(overrides) {
  // TODO: Build this to temp
  const report = await runTS(logger, 'es6', overrides);

  // TODO: Build this to dst
  await minifyJS(logger, report, overrides);

  return report;
}

function gulpBuild(name, overrides) {
  const func = () => build(name, overrides)
  func.displayName = `@hopin/wbt-ts-js-mod`;
  return func
}

module.exports = {
  build,
  gulpBuild,
};