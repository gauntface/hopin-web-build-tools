import * as fs from 'fs-extra';
import * as path from 'path';
import { parse, NodeType, Node, HTMLElement } from 'node-html-parser';

import {logger} from './utils/_logger';
import {glob} from './utils/_glob';

export class AssetConstructor {
  private dirs: Array<string>;

  private inlineStyles: Array<string>;
  private syncStyles: Array<string>;
  private asyncStyles: Array<string>;

  private inlineScripts: Array<string>;
  private syncScripts: Array<string>;
  private asyncScripts: Array<string>;

  constructor(dirs: Array<string>) {
    if (!dirs || dirs.length == 0) {
      throw new Error('Directory is required');
    }

    this.dirs = dirs;
    this.inlineStyles = [];
    this.syncStyles = [];
    this.asyncStyles = [];
    this.inlineScripts = [];
    this.syncScripts = [];
    this.asyncScripts = [];
  }

  async processHTML(html: string) {
    const node = parse(html);
    await this.processChildren(node);
  }

  getInlineStyles(): Array<string> {
    return this.inlineStyles;
  }

  getSyncStyles(): Array<string> {
    return this.syncStyles;
  }

  getAsyncStyles(): Array<string> {
    return this.asyncStyles;
  }

  getInlineScripts(): Array<string> {
    return this.inlineScripts;
  }

  getSyncScripts(): Array<string> {
    return this.syncScripts;
  }

  getAsyncScripts(): Array<string> {
    return this.asyncScripts;
  }

  private async performGlobs(assetName: string, ext: string, assetLists: {inline: Array<string>, sync: Array<string>, async: Array<string>}) {
    for (const d of this.dirs) {
      const inlineGlob = path.join(d, '**', `${assetName}*(-inline).${ext}`);
      const syncGlob = path.join(d, '**', `${assetName}-sync.${ext}`);
      const asyncGlob = path.join(d, '**', `${assetName}-async.${ext}`);

      try {
        const results = await glob(inlineGlob);
        for (const r of results) {
          assetLists.inline.push(r);
        }
      } catch (err) {
        logger.log(`Failed to glob for ${inlineGlob}:`, err);
      }

      try {
        const results = await glob(syncGlob);
        for (const r of results) {
          assetLists.sync.push(r);
        }
      } catch (err) {
        logger.error(`Failed to glob for ${syncGlob}:`, err);
      }

      try {
        const results = await glob(asyncGlob);
        for (const r of results) {
          assetLists.async.push(r);
        }
      } catch (err) {
        logger.error(`Failed to glob for ${asyncGlob}:`, err);
      }
    }
  }

  private async addStyles(assetName: string) {
    await this.performGlobs(assetName, 'css', {
      inline: this.inlineStyles,
      sync: this.syncStyles,
      async: this.asyncStyles,
    });
  }

  private async addScripts(assetName: string) {
    await this.performGlobs(assetName, 'js', {
      inline: this.inlineScripts,
      sync: this.syncScripts,
      async: this.asyncScripts,
    });
  }

  private async processChildren(e: Node) {
    for (const c of e.childNodes) {
      await this.processElement(c);
    }
  }

  private async processElement(e: Node) {
    const promises: Array<Promise<void>> = []; 
    if (e.nodeType == NodeType.ELEMENT_NODE) {
      const html = e as HTMLElement
      // Add assets for HTML tag
      promises.push(this.addAssetsForTag(html.tagName));

      for (const key of Object.keys(html.attributes)) {
        if (key === 'class') {
          // Add assets for class name
          promises.push(this.addAssetsForClass(html.attributes[key]));
        } else {
          // Add assets for atttribute key
          promises.push(this.addAssetsForAttributeKey(key));
        }
      }
      promises.push(this.processChildren(e));
    }
    await Promise.all(promises);
  }

  private async addAssetsForTag(tag: string) {
    logger.log(`Adding assets for tag ${tag}`);
    await this.addStyles(tag);
    await this.addScripts(tag);
  }

  private async addAssetsForClass(classname: string) {
    logger.log(`Adding assets for class ${classname}`);
    await this.addStyles(classname);
    await this.addScripts(classname);
  }

  private async addAssetsForAttributeKey(key: string) {
    logger.log(`Adding assets for attribute ${key}`);
    await this.addStyles(key);
    await this.addScripts(key);
  }
}