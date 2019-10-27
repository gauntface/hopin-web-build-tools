import * as fs from 'fs-extra';
import { AssetConstructor } from "./_asset-constructor";

export type Assets = {
  inlineStylesPath: Array<String>
  syncStylesPath: Array<String>
  asyncStylesPath: Array<String>

  inlineScriptsPath: Array<String>
  syncScriptsPath: Array<String>
  asyncScriptsPath: Array<String>
}

export async function getAssetsForHTMLFile(htmlPath: string, assetPaths: string|Array<string>): Promise<Assets> {
  const f = await fs.readFile(htmlPath);
  return getAssetsForHTML(f.toString(), assetPaths);
}

export async function getAssetsForHTML(html: string, assetPaths: string|Array<string>): Promise<Assets> {
  if (!Array.isArray(assetPaths)) {
    assetPaths = [assetPaths];
  }
  const ac = new AssetConstructor(assetPaths);
  await ac.processHTML(html);
  return {
    inlineStylesPath: ac.getInlineStyles(),
    syncStylesPath: ac.getSyncStyles(),
    asyncStylesPath: ac.getAsyncStyles(),

    inlineScriptsPath: ac.getInlineScripts(),
    syncScriptsPath: ac.getSyncScripts(),
    asyncScriptsPath: ac.getAsyncScripts(),
  }
}