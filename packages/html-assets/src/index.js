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
    const { stdout, stderr } = await exec(`${binPath} --html_dir=${opts.htmlPath} --assets_dir=${opts.assetPath} --json_assets_dir=${opts.jsonAssetsPath} --debug=${opts.debug}`)
    if (opts.output) {
      if (stdout) {
        logger.log(`Output from html asset tool:\n\n${stdout}`);
      }
      if (stderr) {
        logger.error(`Error output from html asset tool:\n\n${stderr}`);
      }
    }
  } catch (err) {
    if (err.stdout) {
      logger.log(`Output from html asset tool:\n\n${err.stdout}`);
    }
    if (err.stderr) {
      logger.error(`Error output from html asset tool:\n\n${err.stderr}`);
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