import { app, BrowserWindow } from 'electron'
import { join } from 'path'

const createWindows = (): void => {
  const preloadPath = join(__dirname, '../preload/index.js')

  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Window 1 — Worker A (Generator)',
    webPreferences: {
      preload: preloadPath,
      sandbox: false
    }
  })

  const secondaryWindow = new BrowserWindow({
    width: 600,
    height: 400,
    x: 620,
    title: 'Window 2 — Worker B (Relay)',
    webPreferences: {
      preload: preloadPath,
      sandbox: false
    }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    const baseUrl = process.env['ELECTRON_RENDERER_URL']
    mainWindow.loadURL(`${baseUrl}/main-window/index.html`)
    secondaryWindow.loadURL(`${baseUrl}/secondary-window/index.html`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/main-window/index.html'))
    secondaryWindow.loadFile(join(__dirname, '../renderer/secondary-window/index.html'))
  }
}

app.whenReady().then(createWindows)

app.on('window-all-closed', () => {
  app.quit()
})
