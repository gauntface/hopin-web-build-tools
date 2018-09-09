const {runTS, minifyJS} = require('@hopin/wbt-ts-shared');

async function build(subDir) {
  const report = await runTS(subDir, 'es2015');

  await minifyJS('browser');

  return report;
}

build.displayName = `@hopin/wbt-ts-browser`;

module.exports = {
  build,
};