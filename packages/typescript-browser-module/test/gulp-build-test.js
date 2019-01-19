const {promisify} = require('util');
const path = require('path');
const os = require('os');
const test = require('ava');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');

const {gulpBuild} = require('../src');

const mkdtemp = promisify(fs.mkdtemp);

test('should build typescript files using default config', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-browser'));
	setConfig(srcDir, dstDir);

    const buildFn = gulpBuild('examplename');
    t.deepEqual(buildFn.displayName, '@hopin/wbt-ts-browser');
    
	const report = await buildFn();	
	
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