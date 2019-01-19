const {promisify} = require('util');
const path = require('path');
const os = require('os');
const test = require('ava');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');

const {build} = require('../src');

const mkdtemp = promisify(fs.mkdtemp);

test('should build typescript files using default config', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-node'));
	setConfig(srcDir, dstDir);

	const report = await build();	
	
	t.deepEqual(report.srcFiles, [
		path.join(srcDir, 'cli.ts'),
		path.join(srcDir, 'nest', 'nested-file.ts'),
		path.join(srcDir, 'toplevel-file.ts'),
	]);

	const expectedDstFiles = [
		path.join(dstDir, 'cli.js'),
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

	const report = await build({src: 'nest', dst: 'nest'});	
	
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

test('should build typescript files with extra rollup plugin', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-node'));
	setConfig(srcDir, dstDir);

	const report = await build({
		// NOTE: This plugin just prints some logs and does not
		// change the output at all.
		rollupPlugins: [sizeSnapshot()]
	});	
	
	t.deepEqual(report.srcFiles, [
		path.join(srcDir, 'cli.ts'),
		path.join(srcDir, 'nest', 'nested-file.ts'),
		path.join(srcDir, 'toplevel-file.ts'),
	]);

	const expectedDstFiles = [
		path.join(dstDir, 'cli.js'),
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

test('should build typescript files stressing shared uses', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-node'));
	setConfig(srcDir, dstDir);

	const report = await build({
		rootDir: srcDir,
		flags: ['--diagnostics'],
	});	
	
	t.deepEqual(report.srcFiles, [
		path.join(srcDir, 'cli.ts'),
		path.join(srcDir, 'nest', 'nested-file.ts'),
		path.join(srcDir, 'toplevel-file.ts'),
	]);

	const expectedDstFiles = [
		path.join(dstDir, 'cli.js'),
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

test('should handle error caused by bad flags', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-node'));
	setConfig(srcDir, dstDir);

	try {
		await build({
			rootDir: srcDir,
			flags: ['--unknown-flag'],
		});	
		t.fail('Expected error from build');
	} catch (err) {
		t.pass();
	}
});