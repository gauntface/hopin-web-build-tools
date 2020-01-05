const {getConfig} = require('@hopin/wbt-config');
const fs = require('fs-extra');

async function clean(overrides, additionalPaths) {
  const config = getConfig(overrides);
  
  const allPaths = [config.dst];
  if (Array.isArray(additionalPaths)) {
    allPaths.push(additionalPaths);
  }

  const allPromises = [];
  for (const p of allPaths) {
    allPromises.push(fs.remove(p));
  }

  await Promise.all(allPromises);
}

function gulpClean(overrides, additionalPaths) {
  const func = () => clean(overrides, additionalPaths)
  func.displayName = `@hopin/wbt-clean`;
  return func
}

module.exports = {
  clean,
  gulpClean,
};