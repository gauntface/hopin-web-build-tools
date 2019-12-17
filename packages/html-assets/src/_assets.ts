export type Path = {
  fullPath: string
  relativePath: string
}

export type Assets = {
  html: string

  inlineStylesPath: Array<Path>
  syncStylesPath: Array<Path>
  asyncStylesPath: Array<Path>

  inlineScriptsPath: Array<Path>
  syncScriptsPath: Array<Path>
  asyncScriptsPath: Array<Path>
}