const fs = require('fs-extra');
const test = require('ava');
const path = require('path');
const os = require('os');
const {processFiles} = require('../build');

test('add assets to file', async (t) => {
  const srcDir = path.join(__dirname, 'static', 'example');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbt-'));
  await fs.copy(srcDir, tmpDir);

  const indexPath = path.join(tmpDir, 'index.html');
  const origContents = (await fs.readFile(indexPath)).toString();

  await processFiles(tmpDir, tmpDir);
  
  const processedContents = (await fs.readFile(indexPath)).toString();

  t.not(origContents, processedContents);

  t.deepEqual(processedContents, `<html>
  <head>
    <title>Example</title>
  <style>/* attribute-example-inline.css */ /* attribute-example.css (Inline) */</style><link rel="stylesheet" type="text/css" href="/css/html/p-sync.css" /><link rel="stylesheet" type="text/css" href="/components/c-example-sync.css" /><link rel="stylesheet" type="text/css" href="/attribute-example-sync.css" /></head>
  <body>
    <p>This is a test piece of html</p>

    <div class="c-example" attribute-example="true"></div>
  <script>/* attribute-example-inline.js */</script><script>/* attribute-example.js */</script><script src="/js/html/p-sync.js"></script><script src="/components/c-example-sync.js"></script><script src="/attribute-example-sync.js"></script><script>const a = ['/css/html/p-async.css', '/components/c-example-async.css', '/attribute-example-async.css']; !function(){"use strict";window.addEventListener("load",function(){!function(n){if(n)for(const o of n)console.log("TODO: Add stylesheet ",o)}(a)})}();
</script><script async defer src="/js/html/p-async.js"></script><script async defer src="/components/c-example-async.js"></script><script async defer src="/attribute-example-async.js"></script></body>
</html>`);
})