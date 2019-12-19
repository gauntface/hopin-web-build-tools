import * as fs from 'fs-extra';
import * as path from 'path';
import * as cheerio from 'cheerio';
import {Assets, Path} from './_assets';

export async function injectAssets(assets: Assets): Promise<string> {
  const $ = cheerio.load(assets.html);
  if (assets.inlineStylesPath.length > 0) {
    await addInlineStyles($, assets.inlineStylesPath);
    await addSyncStyles($, assets.syncStylesPath);

    await addInlineScripts($, assets.inlineScriptsPath);
    await addSyncScripts($, assets.syncScriptsPath);

    await addAsyncStyles($, assets.asyncStylesPath);
    await addAsyncScripts($, assets.asyncScriptsPath);
  }
  return $.root().html();
}

async function addInlineStyles($: CheerioStatic, styles: Array<Path>): Promise<void> {
  if (styles.length == 0) {
    return
  }

  const headElement = $('head');
  if (headElement == null) {
    return
  }

  const files = await readFiles(styles);
  if (files.length <= 0) {
    return
  }

  const styleTag = $(`<style>${files.join(' ')}</style>`);
  headElement.append(styleTag);
}

async function addInlineScripts($: CheerioStatic, scripts: Array<Path>): Promise<void> {
  if (scripts.length == 0) {
    return
  }

  const bodyElement = $('body');
  if (bodyElement == null) {
    return
  }

  const files = await readFiles(scripts);
  if (files.length <= 0) {
    return
  }

  for (const f of files) {
    const scriptTag = $(`<script>${f}</script>`);
    bodyElement.append(scriptTag);
  }
}

async function addSyncStyles($: CheerioStatic, styles: Array<Path>): Promise<void> {
  if (styles.length == 0) {
    return
  }

  const headElement = $('head');
  if (headElement == null) {
    return
  }

  for (const s of styles) {
    const linkTag = $(`<link rel="stylesheet" type="text/css" href="${s.relativePath}" />`);
    headElement.append(linkTag);
  }
}

async function addSyncScripts($: CheerioStatic, scripts: Array<Path>): Promise<void> {
  if (scripts.length == 0) {
    return
  }

  const bodyElement = $('body');
  if (bodyElement == null) {
    return
  }

  for (const s of scripts) {
    const scriptTag = $(`<script src="${s.relativePath}"></script>`);
    bodyElement.append(scriptTag);
  }
}

async function addAsyncStyles($: CheerioStatic, styles: Array<Path>): Promise<void> {
  if (styles.length == 0) {
    return
  }

  const bodyElement = $('body');
  if (bodyElement == null) {
    return
  }

  const parsedStyles = styles.map((s) => `'${s.relativePath}'`);
  const manualJS = `const a = [${parsedStyles.join(', ')}];`;
  const asyncJSScript = await fs.readFile(path.join(__dirname, 'browser-assets', 'async-css-script.js'));
  
  const scriptTag = $(`<script>${manualJS} ${asyncJSScript}</script>`);
  bodyElement.append(scriptTag);
}

async function addAsyncScripts($: CheerioStatic, scripts: Array<Path>): Promise<void> {
  const bodyElement = $('body');
  if (bodyElement == null) {
    return
  }

  for (const s of scripts) {
    const scriptTag = $(`<script async defer src="${s.relativePath}"></script>`);
    bodyElement.append(scriptTag);
  }
}

async function readFiles(filePaths: Array<Path>): Promise<Array<string>> {
  const promises: Array<Promise<string>> = [];
  for (const fp of filePaths) {
    promises.push(fs.readFile(fp.fullPath).then((b) => b.toString()))
  }

  const files = await Promise.all(promises);
  const filesToInclude = files.filter((f) => {
    return f.trim().length > 0
  })

  return filesToInclude
}