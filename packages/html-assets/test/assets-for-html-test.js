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
		{
			fullPath: path.join(srcDir, 'css', 'html', 'p-inline.min.css'),
			relativePath: path.join(path.sep, 'css', 'html', 'p-inline.min.css'),
		},
		{
			fullPath: path.join(srcDir, 'css', 'html', 'p.min.css'),
			relativePath: path.join(path.sep, 'css', 'html', 'p.min.css'),
		},
		{
			fullPath: path.join(srcDir, 'components', 'c-example-inline.min.css'),
			relativePath: path.join(path.sep, 'components', 'c-example-inline.min.css'),
		},
		{
			fullPath: path.join(srcDir, 'components', 'c-example.min.css'),
			relativePath: path.join(path.sep, 'components', 'c-example.min.css'),
		},
		{
			fullPath: path.join(srcDir, 'attribute-example-inline.min.css'),
			relativePath: path.join(path.sep, 'attribute-example-inline.min.css'),
		},
		{
			fullPath: path.join(srcDir, 'attribute-example.min.css'),
			relativePath: path.join(path.sep, 'attribute-example.min.css'),
		},
	]);

	t.deepEqual(assets.syncStylesPath, [
		{
			fullPath: path.join(srcDir, 'css', 'html', 'p-sync.min.css'),
			relativePath: path.join(path.sep, 'css', 'html', 'p-sync.min.css'),
		},
		{
			fullPath: path.join(srcDir, 'components', 'c-example-sync.min.css'),
			relativePath: path.join(path.sep, 'components', 'c-example-sync.min.css'),
		},
		{
			fullPath: path.join(srcDir, 'attribute-example-sync.min.css'),
			relativePath: path.join(path.sep, 'attribute-example-sync.min.css'),
		},
	]);

	t.deepEqual(assets.asyncStylesPath, [
	{
		fullPath: path.join(srcDir, 'css', 'html', 'p-async.min.css'),
		relativePath: path.join(path.sep, 'css', 'html', 'p-async.min.css'),
	},
	{
		fullPath: path.join(srcDir, 'components', 'c-example-async.min.css'),
		relativePath: path.join(path.sep, 'components', 'c-example-async.min.css'),
	},
	{
		fullPath: path.join(srcDir, 'attribute-example-async.min.css'),
		relativePath: path.join(path.sep, 'attribute-example-async.min.css'),
	},
	]);

	t.deepEqual(assets.inlineScriptsPath, [
	{
		fullPath: path.join(srcDir, 'js', 'html', 'p-inline.js'),
		relativePath: path.join(path.sep, 'js', 'html', 'p-inline.js'),
	},
	{
		fullPath: path.join(srcDir, 'js', 'html', 'p.js'),
		relativePath: path.join(path.sep, 'js', 'html', 'p.js'),
	},
	{
		fullPath: path.join(srcDir, 'components', 'c-example-inline.js'),
		relativePath: path.join(path.sep, 'components', 'c-example-inline.js'),
	},
	{
		fullPath: path.join(srcDir, 'components', 'c-example.js'),
		relativePath: path.join(path.sep, 'components', 'c-example.js'),
	},
	{
		fullPath: path.join(srcDir, 'attribute-example-inline.js'),
		relativePath: path.join(path.sep, 'attribute-example-inline.js'),
	},
	{
		fullPath: path.join(srcDir, 'attribute-example.js'),
		relativePath: path.join(path.sep, 'attribute-example.js'),
	},
	]);

	t.deepEqual(assets.syncScriptsPath, [
	{
		fullPath: path.join(srcDir, 'js', 'html', 'p-sync.js'),
		relativePath: path.join(path.sep, 'js', 'html', 'p-sync.js'),
	},
	{
		fullPath: path.join(srcDir, 'components', 'c-example-sync.js'),
		relativePath: path.join(path.sep, 'components', 'c-example-sync.js'),
	},
	{
		fullPath: path.join(srcDir, 'attribute-example-sync.js'),
		relativePath: path.join(path.sep, 'attribute-example-sync.js'),
	},
	]);

	t.deepEqual(assets.asyncScriptsPath, [
	{
		fullPath: path.join(srcDir, 'js', 'html', 'p-async.js'),
		relativePath: path.join(path.sep, 'js', 'html', 'p-async.js'),
	},
	{
		fullPath: path.join(srcDir, 'components', 'c-example-async.js'),
		relativePath: path.join(path.sep, 'components', 'c-example-async.js'),
	},
	{
		fullPath: path.join(srcDir, 'attribute-example-async.js'),
		relativePath: path.join(path.sep, 'attribute-example-async.js'),
	},
	]);
});