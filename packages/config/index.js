const path = require('path');
const {factory} = require('@hopin/logger');
const childProcess = require('child_process');

const logger = factory.getLogger('hopin-wbt', {
  prefix: '[hopin-wbt]'
});

let srcDirectory = null;
let dstDirectory = null;
let additionalState = null;

function setConfig(srcDir, dstDir, state = {}) {
  if (typeof srcDir !== 'string') {
    logger.error('setConfig() expected `srcDir` to be a string, got: ', typeof srcDir);
    throw new Error('setConfig() expected `srcDir` to be a string');
  }

  if (!path.isAbsolute(srcDir)) {
    logger.error('setConfig() requires `srcDir` to be an *absolute* path, got: ', srcDir);
  }

  if (typeof dstDir !== 'string') {
    logger.error('setConfig() expected `dstDir` to be a string, got: ', typeof dstDir);
    throw new Error('setConfig() expected `dstDir` to be a string');
  }

  if (!path.isAbsolute(dstDir)) {
    logger.error('setConfig() requires `dstDir` to be an *absolute* path, got: ', dstDir);
  }

  if (typeof state !== 'object' || Array.isArray(state)) {
    logger.error('setConfig() expected `state` to be an object, got: ', state);
    throw new Error('setConfig() expected `state` to be an object');
  }

  srcDirectory = srcDir
  dstDirectory = dstDir
  additionalState = state
}

function getConfig() {
  return {
    src: srcDirectory,
    dst: dstDirectory,
    state: additionalState,
  }
}

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
  setConfig,
  getConfig,
  spawn,
}