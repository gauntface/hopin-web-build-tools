const path = require('path');
const {logger} = require('@hopin/wbt-common');

let srcDirectory = null;
let dstDirectory = null;
let additionalState = null;

function setConfig(srcRootDir, dstRootDir, state = {}) {
  if (typeof srcDir !== 'string') {
    logger.error('setConfig() expected `srcDir` to be a string, got: ', typeof srcDir);
    throw new Error('setConfig() expected `srcDir` to be a string');
  }

  if (!path.isAbsolute(srcDir)) {
    srcDir = path.resolve(srcDir);
    logger.error('setConfig() `srcDir` should be an *absolute* path. Resolving to: ', srcDir);
  }

  if (typeof dstDir !== 'string') {
    logger.error('setConfig() expected `dstDir` to be a string, got: ', typeof dstDir);
    throw new Error('setConfig() expected `dstDir` to be a string');
  }

  if (!path.isAbsolute(dstDir)) {
    dstDir = path.resolve(dstDir);
    logger.error('setConfig() `dstDir` should be an *absolute* path. Resolving to: ', dstDir);
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

module.exports = {
  setConfig,
  getConfig,
}