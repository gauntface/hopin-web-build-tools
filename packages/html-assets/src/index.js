const path = require('path');
const util = require('util');
const { logger } = require('./utils/_logger');

const exec = util.promisify(require('child_process').exec);

async function processFiles(opts) {
  if (!opts.assetPath) {
    opts.assetPath = opts.htmlPath;
  }

  const binPath = path.join(__dirname, '..', 'bin', 'htmlassets');
  try {
    const { stdout, stderr } = await exec(`${binPath} --html_dir=${opts.htmlPath} --assets_dir=${opts.assetPath} --silent=${opts.silent ? 'true' : 'false'}`)
    if (!opts.silent) {
      if (stdout) {
        logger.log(stdout);
      }
      if (stderr) {
        logger.warn(stderr);
      }
    }
  } catch (err) {
    if (err.stdout) {
      logger.error(err.stdout);
    }
    if (err.stderr) {
      logger.error(err.stderr);
    }
    throw err
  }
}

function gulpProcessFiles(opts) {
  const f = () => processFiles(opts);
  f.displayName = '@hopin/wbt-html-assets';
  return f
}

module.exports = {
  processFiles,
  gulpProcessFiles,
};