const {promisify} = require('util');
const path = require('path');
const os = require('os');
const test = require('ava');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');

const {clean, gulpClean} = require('../src');

const mkdtemp = promisify(fs.mkdtemp);

test.serial('should clean files using default config', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'example');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-clean'));
	await fs.copy(srcDir, dstDir);
	setConfig(srcDir, dstDir);

	await clean({});	

  const exists = await fs.exists(dstDir)
  t.deepEqual(exists, false);
});

test.serial('should clean files using default config with extra values', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'example');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-clean'));
	await fs.copy(srcDir, dstDir);
	setConfig(srcDir, dstDir);

	const additionalDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-clean'));
	await fs.copy(srcDir, additionalDir);

	await clean({}, [additionalDir]);	

  const exists = await fs.exists(dstDir)
	t.deepEqual(exists, false);
	
	const additionalExists = await fs.exists(additionalDir)
  t.deepEqual(additionalExists, false);
});

test.serial('should throw for non array additional paths', async (t) => {
	try {
		await clean({}, '');	
	} catch (err) {
		t.pass();
	}
});

test.serial('should gulp build css files using default config', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'example');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-clean'));
	await fs.copy(srcDir, dstDir);
	setConfig(srcDir, dstDir);

	const cleanFn = gulpClean({});
	t.deepEqual(cleanFn.displayName, '@hopin/wbt-clean');

	await cleanFn();

	const exists = await fs.exists(dstDir)
  t.deepEqual(exists, false);
});