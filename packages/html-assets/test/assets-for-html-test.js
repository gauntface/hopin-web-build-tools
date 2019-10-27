const {promisify} = require('util');
const path = require('path');
const os = require('os');
const test = require('ava');
const fs = require('fs-extra');

const {getAssetsForHTMLFile} = require('../build');

test('error for empty assets array', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'example');
	await t.throwsAsync(() => {
		return getAssetsForHTMLFile(path.join(srcDir, 'index.html'), []);
	}, 'Directory is required');
})

test('find html assets', async (t) => {
	const srcDir = path.join(__dirname, 'static', 'example');
  const assets = await getAssetsForHTMLFile(path.join(srcDir, 'index.html'), srcDir);  
	
	t.deepEqual(assets.inlineStylesPath, [
		path.join(srcDir, 'css', 'html', 'p-inline.css'),
		path.join(srcDir, 'css', 'html', 'p.css'),
		path.join(srcDir, 'components', 'c-example-inline.css'),
		path.join(srcDir, 'components', 'c-example.css'),
		path.join(srcDir, 'attribute-example-inline.css'),
		path.join(srcDir, 'attribute-example.css'),
	]);

	t.deepEqual(assets.syncStylesPath, [
		path.join(srcDir, 'css', 'html', 'p-sync.css'),
		path.join(srcDir, 'components', 'c-example-sync.css'),
		path.join(srcDir, 'attribute-example-sync.css'),
	]);

	t.deepEqual(assets.asyncStylesPath, [
		path.join(srcDir, 'css', 'html', 'p-async.css'),
		path.join(srcDir, 'components', 'c-example-async.css'),
		path.join(srcDir, 'attribute-example-async.css'),
	]);

	t.deepEqual(assets.inlineScriptsPath, [
		path.join(srcDir, 'js', 'html', 'p-inline.js'),
		path.join(srcDir, 'js', 'html', 'p.js'),
		path.join(srcDir, 'components', 'c-example-inline.js'),
		path.join(srcDir, 'components', 'c-example.js'),
		path.join(srcDir, 'attribute-example-inline.js'),
		path.join(srcDir, 'attribute-example.js'),
	]);

	t.deepEqual(assets.syncScriptsPath, [
		path.join(srcDir, 'js', 'html', 'p-sync.js'),
		path.join(srcDir, 'components', 'c-example-sync.js'),
		path.join(srcDir, 'attribute-example-sync.js'),
	]);

	t.deepEqual(assets.asyncScriptsPath, [
		path.join(srcDir, 'js', 'html', 'p-async.js'),
		path.join(srcDir, 'components', 'c-example-async.js'),
		path.join(srcDir, 'attribute-example-async.js'),
	]);
});