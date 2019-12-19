import * as fs from 'fs-extra';
import * as path from 'path';
import {glob} from "./utils/_glob";
import { AssetConstructor } from "./_asset-constructor";
import { injectAssets } from "./_asset-injector";
import {Assets} from './_assets';

export {Assets} from './_assets';
export {injectAssets} from './_asset-injector';

export async function getAssetsForHTMLFile(htmlPath: string, assetPaths: string|Array<string>): Promise<Assets> {
  const f = await fs.readFile(htmlPath);
  return getAssetsForHTML(htmlPath, f.toString(), assetPaths);
}

export async function getAssetsForHTML(id: string, html: string, assetPaths: string|Array<string>): Promise<Assets> {
  if (!Array.isArray(assetPaths)) {
    assetPaths = [assetPaths];
  }
  const ac = new AssetConstructor(assetPaths);
  await ac.processHTML(id, html);
  return {
    html: html,
    inlineStylesPath: ac.getInlineStyles(),
    syncStylesPath: ac.getSyncStyles(),
    asyncStylesPath: ac.getAsyncStyles(),

    inlineScriptsPath: ac.getInlineScripts(),
    syncScriptsPath: ac.getSyncScripts(),
    asyncScriptsPath: ac.getAsyncScripts(),
  }
}

export async function processFiles(htmlPaths: string|Array<string>, assetPaths: string|Array<string>) {
  if (!Array.isArray(htmlPaths)) {
    htmlPaths = [htmlPaths];
  }

  if (!Array.isArray(assetPaths)) {
    assetPaths = [assetPaths];
  }

  const htmlFiles: Array<string> = [];
  for(const d of htmlPaths) {
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
    const assets = await getAssetsForHTMLFile(h, assetPaths);
    const newContents = await injectAssets(assets);
    await fs.writeFile(h, newContents);
  }
}

export function gulpProcessFiles(htmlPaths: string|Array<string>, assetPaths: string|Array<string>): () => Promise<void> {
  return () => processFiles(htmlPaths, assetPaths);
}