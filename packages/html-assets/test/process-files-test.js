const fs = require('fs-extra');
const test = require('ava');
const path = require('path');
const os = require('os');
const { processFiles, gulpProcessFiles } = require('../src');

test('add assets to file with default extensions', async (t) => {
  const srcDir = path.join(__dirname, 'static', 'example');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbt-'));
  await fs.copy(srcDir, tmpDir);

  const indexPath = path.join(tmpDir, 'index.html');
  const origContents = (await fs.readFile(indexPath)).toString();

  await processFiles({
    htmlPath: tmpDir,
  });

  const processedContents = (await fs.readFile(indexPath)).toString();
  t.not(origContents, processedContents);
})

test('add assets to file via gulp function with default extensions', async (t) => {
  const srcDir = path.join(__dirname, 'static', 'example');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbt-'));
  await fs.copy(srcDir, tmpDir);

  const indexPath = path.join(tmpDir, 'index.html');
  const origContents = (await fs.readFile(indexPath)).toString();

  const f = gulpProcessFiles({
    htmlPath: tmpDir,
    silent: false,
  });
  await f();

  const processedContents = (await fs.readFile(indexPath)).toString();
  t.not(origContents, processedContents);
});