import * as fs from 'fs-extra';
import * as path from 'path';
import {glob} from "./utils/_glob";
import { AssetConstructor, ExtensionConfig} from "./_asset-constructor";
import { injectAssets } from "./_asset-injector";
import {Assets} from './_assets';
import { logger } from './utils/_logger';

export {Assets} from './_assets';
export {injectAssets} from './_asset-injector';
export {ExtensionConfig} from './_asset-constructor';

export async function getAssetsForHTMLFile(htmlPath: string, assetPaths: string|Array<string>, extensions?: ExtensionConfig): Promise<Assets> {
  const f = await fs.readFile(htmlPath);
  return getAssetsForHTML(htmlPath, f.toString(), assetPaths, extensions);
}

export async function getAssetsForHTML(id: string, html: string, assetPaths: string|Array<string>, extensions?: ExtensionConfig): Promise<Assets> {
  if (!Array.isArray(assetPaths)) {
    assetPaths = [assetPaths];
  }
  const ac = new AssetConstructor(assetPaths, extensions);
  await ac.processHTML(id, html);
  return {
    html: html,
    inlineStylesPath: ac.getInlineStyles(),
    syncStylesPath: ac.getSyncStyles(),
    asyncStylesPath: ac.getAsyncStyles(),

    inlineScriptsPath: ac.getInlineScripts(),
    syncScriptsPath: ac.getSyncScripts(),
    asyncScriptsPath: ac.getAsyncScripts(),

    tags: ac.getTags(),
    classes: ac.getClasses(),
    attributes: ac.getAttributes(),
  }
}

export type Options = {
  htmlPaths: string|Array<string>;
  assetPaths: string|Array<string>;
  extensions?: ExtensionConfig;
};

export async function processFiles(opts: Options) {
  if (!Array.isArray(opts.htmlPaths)) {
    opts.htmlPaths = [opts.htmlPaths];
  }

  if (!opts.assetPaths) {
    opts.assetPaths = opts.htmlPaths
  } else if (!Array.isArray(opts.assetPaths)) {
    opts.assetPaths = [opts.assetPaths];
  }

  const htmlFiles: Array<string> = [];
  for(const d of opts.htmlPaths) {
    const htmlGlob = path.join(d, '**', `*.html`);
    try {
      const results = await glob(htmlGlob);
      for (const r of results) {
        htmlFiles.push(r);
      }
    } catch (err) {
      return err
    }
  }

  for (const h of htmlFiles) {
    const assets = await getAssetsForHTMLFile(h, opts.assetPaths, opts.extensions);
    const newContents = await injectAssets(assets);
    await fs.writeFile(h, newContents);
  }
}

export function gulpProcessFiles(opts: Options): () => Promise<void> {
  return () => processFiles(opts);
}