/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  electronAPI: {
    screenshots: {
      captureFullScreen: () => Promise<import('../src/types/Screenshot').Screenshot>
      copyToClipboard: (imageDataUrl: string) => Promise<void>
      deleteScreenshot: (imagePath: string) => Promise<void>
      saveScreenshot: (imageDataUrl: string) => Promise<string | null>
    }
    regionCapture: {
      start: () => Promise<void>
      capture: (x: number, y: number, width: number, height: number) => Promise<import('../src/types/Screenshot').Screenshot>
      cancel: () => Promise<void>
    }
  }
}
