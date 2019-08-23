import { app, BrowserWindow } from 'electron'

let mainWindow: BrowserWindow | null
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:8080`
  : `file://${__dirname}/renderer/index.html`
  /* main.ts 会编译为 "./dist/main.js"; nuxt 生成目录 "./dist/renderer" */

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 1200,
    height: 650,
    minWidth: 1200,
    minHeight: 650,
    frame: false,
    webPreferences: {
      nodeIntegration: true // 集成 node
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env.NODE_ENV === 'development') {
    // Importing dev dependencies
    const {
      default: installExtension,
      VUEJS_DEVTOOLS
    } = require('electron-devtools-installer')

    // Installing devtools
    installExtension(VUEJS_DEVTOOLS).then(() => {})
  }

  mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
