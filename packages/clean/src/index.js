const fs = require('fs-extra');

async function clean(allPaths) {  
  if (allPaths != null && !Array.isArray(allPaths)) {
    throw new Error('@hopin/clean paths must be an array of strings');
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