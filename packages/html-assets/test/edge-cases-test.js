const fs = require('fs-extra');
const test = require('ava');
const path = require('path');
const os = require('os');
const {processFiles} = require('../build');

test('only include single copy of tag class and attrib assets', async (t) => {
  const srcDir = path.join(__dirname, 'static', 'edge-cases');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbt-'));
  await fs.copy(srcDir, tmpDir);

  await processFiles(tmpDir, tmpDir);

  const indexPath = path.join(tmpDir, 'index.html');
  const processedContents = (await fs.readFile(indexPath)).toString();
  t.deepEqual(processedContents, `<html><head>
    <title>Example</title>
  <style>/* p.min.css */ /* example-class.min.css */ /* example.min.css */</style></head>
  <body>
    <p class="example-class" example="true">This is a test piece of html</p>
    <p class="example-class" example="true">Multiple tags, classes and attributes.</p>

    <p>&#xA9; HTML entities should be kept.</p>
  
<script>/* p.js */</script><script>/* example-class.js */</script><script>/* example.js */</script></body></html>`);
})