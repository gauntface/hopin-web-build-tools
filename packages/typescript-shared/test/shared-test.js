const {promisify} = require('util');
const path = require('path');
const os = require('os');
const test = require('ava');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');

const {minifyJS} = require('../src');

test.serial('should throw for unknown output type', async (t) => {
    setConfig('', path.join(__dirname, '..', '..', 'static'))
    try {
        await minifyJS(console, 'unknown');
        t.fail(`Expected an error from minifyJS`);
    } catch (err) {
        t.deepEqual(err.message, `Unknown minify output type: 'unknown'`);
    }
});

test.serial('should throw an error for minifying a non-JS file', async (t) => {
    setConfig('', path.join(__dirname, '..', 'static', 'error-project'))
    
    try {
        await minifyJS(console, 'node');
        t.fail('Expected an error from minifyJS');
    } catch (err) {
        t.deepEqual(err.message, `Unable to minify '${path.join(__dirname, '..', 'static', 'error-project', 'bad.js')}' with rollup: Unexpected token`);
    }
});