const {promisify} = require('util');
const path = require('path');
const os = require('os');
const test = require('ava');
const fs = require('fs-extra');
const {Logger} = require('@hopin/logger');

const {minifyJS} = require('../src/minify');

const mkdtemp = promisify(fs.mkdtemp);

test('should handle errors from terser', async (t) => {
    const srcFile = path.join(__dirname, 'static', 'minify-examples', 'error-file.js');
    const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-js-mod'));
    const dstFile = path.join(tmpDir, 'error-file.js');
    await fs.copy(srcFile, dstFile);

    const logger = new Logger();
    const report = {
        srcFiles: [dstFile],
    };

    try {
        await minifyJS(logger, report);
        t.fail(`Expected an error from minifyJS`);
    } catch (err) {
        t.deepEqual(err.message, `Minification returned an error. See logs for details.`);
    }
});

test('should handle warnings from terser', async (t) => {
    const srcFile = path.join(__dirname, 'static', 'minify-examples', 'warnings-file.js');
    const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-js-mod'));
    const dstFile = path.join(tmpDir, 'warnings-file.js');
    await fs.copy(srcFile, dstFile);

    const logger = new Logger();
    const report = {
        srcFiles: [dstFile],
    };

    await minifyJS(logger, report);
    t.pass();
});