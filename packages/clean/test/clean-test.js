const {promisify} = require('util');
const path = require('path');
const os = require('os');
const test = require('ava');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');

const {clean, gulpClean} = require('../src');

const mkdtemp = promisify(fs.mkdtemp);

test.serial('should clean files using args', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'example');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-clean'));
	await fs.copy(srcDir, dstDir);

	const additionalDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-clean'));
	await fs.copy(srcDir, additionalDir);

	await clean([dstDir, additionalDir]);	

  const exists = await fs.exists(dstDir)
	t.deepEqual(exists, false);
	
	const additionalExists = await fs.exists(additionalDir)
  t.deepEqual(additionalExists, false);
});

test.serial('should throw for non array of paths', async (t) => {
	try {
		await clean('');	
	} catch (err) {
		t.pass();
	}
});

test.serial('should gulp build css files using default config', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'example');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-clean'));
	await fs.copy(srcDir, dstDir);

	const cleanFn = gulpClean([dstDir]);
	t.deepEqual(cleanFn.displayName, '@hopin/wbt-clean');

	await cleanFn();

	const exists = await fs.exists(dstDir)
  t.deepEqual(exists, false);
});