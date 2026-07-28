import { createRequire } from 'node:module'
import type { BrowserWindow as ElectronBrowserWindow } from 'electron'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { app, BrowserWindow, clipboard, desktopCapturer, dialog, ipcMain, nativeImage, screen } = require('electron') as typeof import('electron')

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: ElectronBrowserWindow | null

function screenshotDirectory() { return path.join(app.getPath('userData'), 'screenshots') }

function imageFromDataUrl(imageDataUrl: string) {
  if (!imageDataUrl.startsWith('data:image/')) throw new Error('Invalid screenshot image data.')
  return nativeImage.createFromDataURL(imageDataUrl)
}

async function captureFullScreen() {
  const primaryDisplay = screen.getPrimaryDisplay()
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: primaryDisplay.size.width, height: primaryDisplay.size.height },
  })
  const source = sources.find((candidate) => candidate.display_id === String(primaryDisplay.id))
    ?? sources.find((candidate) => !candidate.thumbnail.isEmpty())
  if (!source) throw new Error('No capturable display was found.')

  const image = source.thumbnail
  const id = crypto.randomUUID()
  const timestamp = new Date().toISOString()
  const directory = screenshotDirectory()
  const imagePath = path.join(directory, `${id}.png`)
  await mkdir(directory, { recursive: true })
  await writeFile(imagePath, image.toPNG())
  return { id, imageDataUrl: image.toDataURL(), imagePath, timestamp }
}

ipcMain.handle('screenshot:capture-full', captureFullScreen)
ipcMain.handle('screenshot:copy', (_event, imageDataUrl: string) => { clipboard.writeImage(imageFromDataUrl(imageDataUrl)) })
ipcMain.handle('screenshot:save', async (_event, imageDataUrl: string) => {
  const { canceled, filePath } = await dialog.showSaveDialog({ defaultPath: 'VisionDesk Screenshot.png', filters: [{ extensions: ['png'], name: 'PNG Image' }] })
  if (canceled || !filePath) return null
  await writeFile(filePath, imageFromDataUrl(imageDataUrl).toPNG())
  return filePath
})
ipcMain.handle('screenshot:delete', async (_event, imagePath: string) => {
  const directory = screenshotDirectory()
  const relativePath = path.relative(directory, imagePath)
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) throw new Error('Invalid screenshot path.')
  await unlink(imagePath)
})

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
