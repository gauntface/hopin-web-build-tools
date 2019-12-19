import * as fs from 'fs-extra';
import * as path from 'path';
import { parse, NodeType, Node, HTMLElement } from 'node-html-parser';

import {Path} from './_assets';
import {logger} from './utils/_logger';
import {glob} from './utils/_glob';

export class AssetConstructor {
  private dirs: Array<string>;

  private inlineStyles: Array<Path>;
  private syncStyles: Array<Path>;
  private asyncStyles: Array<Path>;

  private inlineScripts: Array<Path>;
  private syncScripts: Array<Path>;
  private asyncScripts: Array<Path>;

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

  // The ID variable is just used to identify the log output.
  async processHTML(id: string, html: string) {
    logger.group(`Processing HTML file: ${id}`);
    const node = parse(html);
    await this.processChildren(node);
    logger.groupEnd();
  }

  getInlineStyles(): Array<Path> {
    return this.inlineStyles;
  }

  getSyncStyles(): Array<Path> {
    return this.syncStyles;
  }

  getAsyncStyles(): Array<Path> {
    return this.asyncStyles;
  }

  getInlineScripts(): Array<Path> {
    return this.inlineScripts;
  }

  getSyncScripts(): Array<Path> {
    return this.syncScripts;
  }

  getAsyncScripts(): Array<Path> {
    return this.asyncScripts;
  }

  private async performGlobs(assetName: string, ext: string, assetLists: {inline: Array<Path>, sync: Array<Path>, async: Array<Path>}) {
    for (const d of this.dirs) {
      const inlineGlob = path.join(d, '**', `${assetName}*(-inline).${ext}`);
      const syncGlob = path.join(d, '**', `${assetName}-sync.${ext}`);
      const asyncGlob = path.join(d, '**', `${assetName}-async.${ext}`);

      try {
        const results = await glob(inlineGlob);
        for (const r of results) {
          if (hasPath(assetLists.inline, r)) {
            continue;
          }

          const relativePath = path.join(path.sep, path.relative(d, r));
          logger.log(`Found inline file: ${relativePath}`);
          assetLists.inline.push({
            fullPath: r,
            relativePath: relativePath,
          });
        }
      } catch (err) {
        logger.warn(`Failed to glob for ${inlineGlob}:`, err);
      }

      try {
        const results = await glob(syncGlob);
        for (const r of results) {
          if (hasPath(assetLists.sync, r)) {
            continue;
          }

          const relativePath = path.join(path.sep, path.relative(d, r));
          logger.log(`Found sync file: ${relativePath}`);
          assetLists.sync.push({
            fullPath: r,
            relativePath: relativePath,
          });
        }
      } catch (err) {
        logger.error(`Failed to glob for ${syncGlob}:`, err);
      }

      try {
        const results = await glob(asyncGlob);
        for (const r of results) {
          if (hasPath(assetLists.async, r)) {
            continue;
          }

          const relativePath = path.join(path.sep, path.relative(d, r));
          logger.log(`Found async file: ${relativePath}`);
          assetLists.async.push({
            fullPath: r,
            relativePath: relativePath,
          });
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
      switch(html.tagName) {
        case 'svg': {
          break;
        }
        default: {
          promises.push(this.processChildren(e));
        }
      }
    }
    await Promise.all(promises);
  }

  private async addAssetsForTag(tag: string) {
    logger.log(`Searching for assets for tag ${tag}`);
    await this.addStyles(tag);
    await this.addScripts(tag);
  }

  private async addAssetsForClass(classname: string) {
    logger.log(`Searching for assets for class ${classname}`);
    await this.addStyles(classname);
    await this.addScripts(classname);
  }

  private async addAssetsForAttributeKey(key: string) {
    logger.log(`Searching for assets for attribute ${key}`);
    await this.addStyles(key);
    await this.addScripts(key);
  }
}

function hasPath(allPaths: Array<Path>, fullPath: string) {
  for (const p of allPaths) {
    if (p.fullPath == fullPath) {
      return true;
    }
  }
  return false;
}