const {promisify} = require('util');
const path = require('path');
const os = require('os');
const {test} = require('ava');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');
const {logger} = require('@hopin/wbt-common');

const {build} = require('../src');

const mkdtemp = promisify(fs.mkdtemp);

test('should build typescript files using default config', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-node'));
	setConfig(srcDir, dstDir);

	const report = await build();	
	
	t.deepEqual(report.srcFiles, [
		path.join(srcDir, 'nest', 'nested-file.ts'),
		path.join(srcDir, 'toplevel-file.ts'),
	]);

	const expectedDstFiles = [
		path.join(dstDir, 'nest', 'nested-file.js'),
		path.join(dstDir, 'toplevel-file.js'),
	];
	for (const dstFile of expectedDstFiles) {
		try {
			await fs.access(dstFile);
		} catch (err) {
			t.fail(`Unable to read file: ${dstFile}`)
		}
	}
});

test('should build typescript files using custom config', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-node'));
	setConfig(srcDir, dstDir);

	const report = await build('nest');	
	
	t.deepEqual(report.srcFiles, [
		path.join(srcDir, 'nest', 'nested-file.ts'),
	]);

	const expectedDstFiles = [
		path.join(dstDir, 'nest', 'nested-file.js'),
	];
	for (const dstFile of expectedDstFiles) {
		try {
			await fs.access(dstFile);
		} catch (err) {
			t.fail(`Unable to read file: ${dstFile}`)
		}
	}
});