const fs = require('fs-extra');
const test = require('ava');
const path = require('path');
const os = require('os');
const {processFiles, gulpProcessFiles} = require('../build');

test('add assets to file with default extensions', async (t) => {
  const asyncCSSScriptPath = path.join(__dirname, '..', 'build', 'browser-assets', 'async-css-script.js');
  const asyncCSSScript = (await fs.readFile(asyncCSSScriptPath)).toString();

  const srcDir = path.join(__dirname, 'static', 'example');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbt-'));
  await fs.copy(srcDir, tmpDir);

  await processFiles({
    htmlPaths: tmpDir,
  });

  const indexPath = path.join(tmpDir, 'index.html');
  const processedContents = (await fs.readFile(indexPath)).toString();
  t.deepEqual(processedContents, `<html><head>
    <title>Example</title>
  <style>/* attribute-example-inline.css */</style><style>/* attribute-example.css (Inline) */</style><link rel="stylesheet" type="text/css" href="/css/html/p-sync.css"><link rel="stylesheet" type="text/css" href="/components/c-example-sync.css"><link rel="stylesheet" type="text/css" href="/attribute-example-sync.css"></head>
  <body>
    <p>This is a test piece of html</p>

    <div class="c-example" attribute-example="true"></div>
    <!-- Additional white space to make sure it's handled correctly -->
    <div class="    c-multi-class-example-1     c-multi-class-example-2    " attribute-example="true"></div>

    <!-- Duplicate HTML to ensure we only get one of each tag, class and attribute -->
    <p>This is a test piece of html</p>

    <div class="c-example" attribute-example="true"></div>
    <!-- Additional white space to make sure it's handled correctly -->
    <div class="    c-multi-class-example-1     c-multi-class-example-2    " attribute-example="true"></div>
  
<script>/* attribute-example-inline.js */</script><script>/* attribute-example.js */</script><script src="/js/html/p-sync.js"></script><script src="/components/c-example-sync.js"></script><script src="/attribute-example-sync.js"></script><script>const a = ['/css/html/p-async.css', '/components/c-example-async.css', '/attribute-example-async.css']; ${asyncCSSScript}</script><script async defer src="/js/html/p-async.js"></script><script async defer src="/components/c-example-async.js"></script><script async defer src="/attribute-example-async.js"></script></body></html>`);
})

test('add assets to file with custom extensions', async (t) => {
  const asyncCSSScriptPath = path.join(__dirname, '..', 'build', 'browser-assets', 'async-css-script.js');
  const asyncCSSScript = (await fs.readFile(asyncCSSScriptPath)).toString();

  const srcDir = path.join(__dirname, 'static', 'example');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbt-'));
  await fs.copy(srcDir, tmpDir);

  await processFiles({
    htmlPaths: tmpDir,
    extensions: {
      css: 'min.css',
      js: 'min.js',
    },
  });

  const indexPath = path.join(tmpDir, 'index.html');
  const processedContents = (await fs.readFile(indexPath)).toString();
  t.deepEqual(processedContents, `<html><head>
    <title>Example</title>
  <style>/* attribute-example-inline.min.css */</style><style>/* attribute-example.min.css (Inline) */</style><link rel="stylesheet" type="text/css" href="/css/html/p-sync.min.css"><link rel="stylesheet" type="text/css" href="/components/c-example-sync.min.css"><link rel="stylesheet" type="text/css" href="/attribute-example-sync.min.css"></head>
  <body>
    <p>This is a test piece of html</p>

    <div class="c-example" attribute-example="true"></div>
    <!-- Additional white space to make sure it's handled correctly -->
    <div class="    c-multi-class-example-1     c-multi-class-example-2    " attribute-example="true"></div>

    <!-- Duplicate HTML to ensure we only get one of each tag, class and attribute -->
    <p>This is a test piece of html</p>

    <div class="c-example" attribute-example="true"></div>
    <!-- Additional white space to make sure it's handled correctly -->
    <div class="    c-multi-class-example-1     c-multi-class-example-2    " attribute-example="true"></div>
  
<script>/* attribute-example-inline.min.js */</script><script>/* attribute-example.min.js */</script><script src="/js/html/p-sync.min.js"></script><script src="/components/c-example-sync.min.js"></script><script src="/attribute-example-sync.min.js"></script><script>const a = ['/css/html/p-async.min.css', '/components/c-example-async.min.css', '/attribute-example-async.min.css']; ${asyncCSSScript}</script><script async defer src="/js/html/p-async.min.js"></script><script async defer src="/components/c-example-async.min.js"></script><script async defer src="/attribute-example-async.min.js"></script></body></html>`);
})

test('add assets to file via gulp function with default extensions', async (t) => {
  const asyncCSSScriptPath = path.join(__dirname, '..', 'build', 'browser-assets', 'async-css-script.js');
  const asyncCSSScript = (await fs.readFile(asyncCSSScriptPath)).toString();

  const srcDir = path.join(__dirname, 'static', 'example');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbt-'));
  await fs.copy(srcDir, tmpDir);

  const indexPath = path.join(tmpDir, 'index.html');
  const origContents = (await fs.readFile(indexPath)).toString();

  const f = gulpProcessFiles({
    htmlPaths: tmpDir,
  });
  await f();

  const processedContents = (await fs.readFile(indexPath)).toString();

  t.not(origContents, processedContents);

  t.deepEqual(processedContents, `<html><head>
    <title>Example</title>
  <style>/* attribute-example-inline.css */</style><style>/* attribute-example.css (Inline) */</style><link rel="stylesheet" type="text/css" href="/css/html/p-sync.css"><link rel="stylesheet" type="text/css" href="/components/c-example-sync.css"><link rel="stylesheet" type="text/css" href="/attribute-example-sync.css"></head>
  <body>
    <p>This is a test piece of html</p>

    <div class="c-example" attribute-example="true"></div>
    <!-- Additional white space to make sure it's handled correctly -->
    <div class="    c-multi-class-example-1     c-multi-class-example-2    " attribute-example="true"></div>

    <!-- Duplicate HTML to ensure we only get one of each tag, class and attribute -->
    <p>This is a test piece of html</p>

    <div class="c-example" attribute-example="true"></div>
    <!-- Additional white space to make sure it's handled correctly -->
    <div class="    c-multi-class-example-1     c-multi-class-example-2    " attribute-example="true"></div>
  
<script>/* attribute-example-inline.js */</script><script>/* attribute-example.js */</script><script src="/js/html/p-sync.js"></script><script src="/components/c-example-sync.js"></script><script src="/attribute-example-sync.js"></script><script>const a = ['/css/html/p-async.css', '/components/c-example-async.css', '/attribute-example-async.css']; ${asyncCSSScript}</script><script async defer src="/js/html/p-async.js"></script><script async defer src="/components/c-example-async.js"></script><script async defer src="/attribute-example-async.js"></script></body></html>`);
});

test('add assets to file via gulp function with custom extensions', async (t) => {
  const asyncCSSScriptPath = path.join(__dirname, '..', 'build', 'browser-assets', 'async-css-script.js');
  const asyncCSSScript = (await fs.readFile(asyncCSSScriptPath)).toString();
  
  const srcDir = path.join(__dirname, 'static', 'example');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbt-'));
  await fs.copy(srcDir, tmpDir);

  const indexPath = path.join(tmpDir, 'index.html');
  const origContents = (await fs.readFile(indexPath)).toString();

  const f = gulpProcessFiles({
    htmlPaths: tmpDir,
    extensions: {
      css: 'min.css',
      js: 'min.js',
    },
  });
  await f();

  const processedContents = (await fs.readFile(indexPath)).toString();

  t.not(origContents, processedContents);

  t.deepEqual(processedContents, `<html><head>
    <title>Example</title>
  <style>/* attribute-example-inline.min.css */</style><style>/* attribute-example.min.css (Inline) */</style><link rel="stylesheet" type="text/css" href="/css/html/p-sync.min.css"><link rel="stylesheet" type="text/css" href="/components/c-example-sync.min.css"><link rel="stylesheet" type="text/css" href="/attribute-example-sync.min.css"></head>
  <body>
    <p>This is a test piece of html</p>

    <div class="c-example" attribute-example="true"></div>
    <!-- Additional white space to make sure it's handled correctly -->
    <div class="    c-multi-class-example-1     c-multi-class-example-2    " attribute-example="true"></div>

    <!-- Duplicate HTML to ensure we only get one of each tag, class and attribute -->
    <p>This is a test piece of html</p>

    <div class="c-example" attribute-example="true"></div>
    <!-- Additional white space to make sure it's handled correctly -->
    <div class="    c-multi-class-example-1     c-multi-class-example-2    " attribute-example="true"></div>
  
<script>/* attribute-example-inline.min.js */</script><script>/* attribute-example.min.js */</script><script src="/js/html/p-sync.min.js"></script><script src="/components/c-example-sync.min.js"></script><script src="/attribute-example-sync.min.js"></script><script>const a = ['/css/html/p-async.min.css', '/components/c-example-async.min.css', '/attribute-example-async.min.css']; ${asyncCSSScript}</script><script async defer src="/js/html/p-async.min.js"></script><script async defer src="/components/c-example-async.min.js"></script><script async defer src="/attribute-example-async.min.js"></script></body></html>`);
});