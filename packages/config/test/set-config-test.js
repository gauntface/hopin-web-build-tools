const test = require('ava');
const sinon = require('sinon');
const path = require('path');

const {setConfig, getConfig} = require('../src');

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

test.serial('should throw when srcDir is not a string', async (t) => {
  try {
    setConfig({});
    t.fail('Expected setConfig to throw an error.');
  } catch (err) {
    t.deepEqual(err.message, 'setConfig() expected `srcDir` to be a string');
  }
});

test.serial('should throw when dstDir is not a string', async (t) => {
  try {
    setConfig(path.join(__dirname, 'static'), {});
    t.fail('Expected setConfig to throw an error.');
  } catch (err) {
    t.deepEqual(err.message, 'setConfig() expected `dstDir` to be a string');
  }
});

test.serial('should throw when state is not an object', async (t) => {
  try {
    setConfig(path.join(__dirname, 'static'), path.join(__dirname, 'static', 'build'), []);
    t.fail('Expected setConfig to throw an error.');
  } catch (err) {
    t.deepEqual(err.message, 'setConfig() expected `state` to be an object');
  }
});

test.serial('should resolve relative paths', async (t) => {
    setConfig(path.join('.', 'static'), path.join('.', 'static', 'build'));
    const config = getConfig();
    t.deepEqual(config.src, path.join(process.cwd(), 'static'));
});