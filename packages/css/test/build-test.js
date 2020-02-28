const {promisify} = require('util');
const path = require('path');
const os = require('os');
const test = require('ava');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');

const {build, gulpBuild} = require('../src');

const mkdtemp = promisify(fs.mkdtemp);

test.serial('should build css files using default config', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-css'));
	setConfig(srcDir, dstDir);

	await build({}, {
		importPaths: [
        	path.join(srcDir, 'static'),
		],
	});	

	const expectedDstFiles = {
		[path.join(dstDir, 'index.dev.css')]: `.root-import{content:"root-import"}.nested-import{content:"nested-import"}.static-import{content:"static-import"}`,
	}
	for (const dstFile of Object.keys(expectedDstFiles)) {
		try {
			await fs.access(dstFile);
			const buffer = await fs.readFile(dstFile);
			const contents = buffer.toString();
			t.deepEqual(contents, expectedDstFiles[dstFile]);
		} catch (err) {
			t.fail(`Unable to read file: ${dstFile}`)
		}
    }
});

test.serial('should build css files where the import fails', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'error-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-css'));
	setConfig(srcDir, dstDir);

	try {
		await build();
		t.fail('Expected build() to thrown an error');
	} catch (err) {
		t.deepEqual(err.message, `Unable to find import './doesnt-exist.css'`);
	}
});

test.serial('should gulp build css files using default config', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-css'));
	setConfig(srcDir, dstDir);

	const buildFn = gulpBuild({}, {
		importPaths: [
			path.join(srcDir, 'static'),
		],
	});
	t.deepEqual(buildFn.displayName, '@hopin/wbt-css');

	await buildFn();	

	const expectedDstFiles = {
		[path.join(dstDir, 'index.dev.css')]: `.root-import{content:"root-import"}.nested-import{content:"nested-import"}.static-import{content:"static-import"}`,
	}
	for (const dstFile of Object.keys(expectedDstFiles)) {
		try {
			await fs.access(dstFile);
			const buffer = await fs.readFile(dstFile);
			const contents = buffer.toString();
			t.deepEqual(contents, expectedDstFiles[dstFile]);
		} catch (err) {
			t.fail(`Unable to read file: ${dstFile}`)
		}
    }
});