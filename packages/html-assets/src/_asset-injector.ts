import * as fs from 'fs-extra';
import * as path from 'path';
import {Assets, Path} from './_assets';
import { parse, NodeType, Node, HTMLElement } from 'node-html-parser';

export async function injectAssets(assets: Assets): Promise<string> {
  let node = parse(assets.html) as HTMLElement;
  if (assets.inlineStylesPath.length > 0) {
    await addInlineStyles(node, assets.inlineStylesPath);
    await addSyncStyles(node, assets.syncStylesPath);

    await addInlineScripts(node, assets.inlineScriptsPath);
    await addSyncScripts(node, assets.syncScriptsPath);

    await addAsyncStyles(node, assets.asyncStylesPath);
    await addAsyncScripts(node, assets.asyncScriptsPath);
  }
  return node.toString();
}

async function addInlineStyles(node: HTMLElement, styles: Array<Path>): Promise<void> {
  if (styles.length == 0) {
    return
  }

  const headElement = node.querySelector('head');
  if (headElement == null) {
    return
  }

  const files = await readFiles(styles);
  if (files.length <= 0) {
    return
  }

  const styleTag = new HTMLElement('style', {});
  styleTag.set_content(files.join(' '));
  headElement.appendChild(styleTag);
}

async function addInlineScripts(node: HTMLElement, scripts: Array<Path>): Promise<void> {
  if (scripts.length == 0) {
    return
  }

  const bodyElement = node.querySelector('body');
  if (bodyElement == null) {
    return
  }

  const files = await readFiles(scripts);
  if (files.length <= 0) {
    return
  }

  for (const f of files) {
    const scriptTag = new HTMLElement('script', {});
    scriptTag.set_content(f);
    bodyElement.appendChild(scriptTag);
  }
}

async function addSyncStyles(node: HTMLElement, styles: Array<Path>): Promise<void> {
  if (styles.length == 0) {
    return
  }

  const headElement = node.querySelector('head');
  if (headElement == null) {
    return
  }

  for (const s of styles) {
    const linkTag = new HTMLElement('link', {}, `rel="stylesheet" type="text/css" href="${s.relativePath}"`);
    headElement.appendChild(linkTag);
  }
}

async function addSyncScripts(node: HTMLElement, scripts: Array<Path>): Promise<void> {
  if (scripts.length == 0) {
    return
  }

  const bodyElement = node.querySelector('body');
  if (bodyElement == null) {
    return
  }

  for (const s of scripts) {
    const scriptTag = new HTMLElement('script', {}, `src="${s.relativePath}"`);
    bodyElement.appendChild(scriptTag);
  }
}

async function addAsyncStyles(node: HTMLElement, styles: Array<Path>): Promise<void> {
  if (styles.length == 0) {
    return
  }

  const bodyElement = node.querySelector('body');
  if (bodyElement == null) {
    return
  }

  const parsedStyles = styles.map((s) => `'${s.relativePath}'`);
  const manualJS = `const a = [${parsedStyles.join(', ')}];`;
  const asyncJSScript = await fs.readFile(path.join(__dirname, 'browser-assets', 'async-css-script.js'));
  const scriptTag = new HTMLElement('script', {});
  scriptTag.set_content(`${manualJS} ${asyncJSScript}`);
  bodyElement.appendChild(scriptTag);
}

async function addAsyncScripts(node: HTMLElement, scripts: Array<Path>): Promise<void> {
  const bodyElement = node.querySelector('body');
  if (bodyElement == null) {
    return
  }

  for (const s of scripts) {
    const scriptTag = new HTMLElement('script', {}, `async defer src="${s.relativePath}"`);
    bodyElement.appendChild(scriptTag);
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