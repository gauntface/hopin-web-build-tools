const {promisify} = require('util');
const path = require('path');
const os = require('os');
const {test} = require('ava');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');

const {build} = require('../src/index');

const mkdtemp = promisify(fs.mkdtemp);

test('should get typescript files', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'working-project');
	const dstDir = await mkdtemp(path.join(os.tmpdir(), 'wbt-ts-node'));
	setConfig(srcDir, dstDir);

	const report = await build();	
	console.log(report);
	t.pass();
});