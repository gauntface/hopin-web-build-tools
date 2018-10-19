const {runTS, minifyJS} = require('@hopin/wbt-ts-shared');
const {Logger} = require('@hopin/logger');

const logger = new Logger();
logger.setPrefix('[@hopin/wbt-ts-browser]');

async function build(name, overrides) {
  // TODO: Build this to temp
  const report = await runTS(logger, 'es2015', overrides);

  // TODO: Build this to dst
  await minifyJS(logger, 'browser', name, overrides);

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