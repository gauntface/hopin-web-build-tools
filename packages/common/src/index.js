const path = require('path');
const {factory} = require('@hopin/logger');
const childProcess = require('child_process');

const logger = factory.getLogger('hopin-wbt', {
  prefix: '[hopin-wbt]'
});

function spawn(cmd, opts) {
  const relativeCmd = path.relative(process.cwd(), cmd);
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const process = childProcess.spawn(cmd, opts);

    process.on('error', (err) => {
      reject(err);
    });

    process.stdout.on('data', (data) => {
      stdout += data;
    });
    
    process.stderr.on('data', (data) => {
      stderr += data;
    });
    
    process.on('close', (code) => {
      if (code !== 0) {
        logger.error(`Output of '${relativeCmd}' process:`);
        logger.error(stdout);
        logger.error(stderr);
        reject(new Error(`command exited with bad code ${code}`));
        return;
      }

      resolve({
        stdout,
        stderr,
        code,
      });
    });
  });
}

module.exports = {
  logger,
  spawn,
}