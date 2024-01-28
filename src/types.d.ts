declare class Blockly {
  static getMainWorkspace(): BlocklyWorkspace
}

declare class BlocklyWorkspace {
  blockDB_: Record<string, BlockSvg>
  scale: number
  scrollbar: {
    set (x: number, y: number): void
  }
  getMetrics (): BlocklyMetrics
}

declare type BlocklyMetrics = {
  viewLeft: number
  viewTop: number
  contentLeft: number
  contentTop: number
  viewWidth: number
  viewHeight: number
}

declare const BlockSvg: any
declare type BlockSvg = any

declare const unsafeWindow: typeof window