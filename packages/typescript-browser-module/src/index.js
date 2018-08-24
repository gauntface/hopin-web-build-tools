const {runTS} = require('@hopin/wbt-ts-shared');

async function build(subDir) {
  const report = runTS(subDir, 'es2015');

  // TODO: Minify output

  return report;
}

build.displayName = `@hopin/wbt-ts-browser`;

module.exports = {
  build,
};