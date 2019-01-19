const path = require('path');
const test = require('ava');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');

const {build} = require('../src');

const {TestServer} = require('./utils/test-server');

let server;
let serverAddress;
let browser;
let page;

async function setupServer() {
  server = new TestServer(__dirname);
  serverAddress = await server.start();
}

async function setupPuppeteer() {
  browser = await puppeteer.launch({args: ['--no-sandbox']});
  page = await browser.newPage();
}

test.before(async () => {
  await Promise.all([
    setupServer(),
    setupPuppeteer(),
  ]);
});

test.after.always(async () => {
  await Promise.all([
    browser.close(),
    server.close(),
  ]);
});

test.serial('should log in browser', async (t) => {
  const srcDir = path.join(__dirname, 'static', 'working-project');
  const dstDir = path.join(__dirname, 'tmp');
  
  await fs.remove(dstDir);

	setConfig(srcDir, dstDir);

	const report = await build('examplename');	
	
	t.deepEqual(report.srcFiles, [
		path.join(srcDir, 'nest', 'nested-file.ts'),
		path.join(srcDir, 'toplevel-file.ts'),
  ]);
  
  page.on('error', msg => {
    t.fail(msg.message);
  });

  const messageData = [];
  page.on('console', msg => {
    messageData.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  const response = await page.goto(`${serverAddress}/static/build-integration/`);
  t.deepEqual(response.status(), 200);

  t.deepEqual(messageData.length, 2);

  t.deepEqual(messageData[0], {
    type: 'log',
    text: 'toplevel-file',
  });

  t.deepEqual(messageData[1], {
    type: 'log',
    text: `window.location.href: ${serverAddress}/static/build-integration/`,
  });
});