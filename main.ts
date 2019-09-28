import * as http from 'http'
import { app, BrowserWindow, ipcMain } from 'electron'

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
    width: 1160,
    height: 715,
    minWidth: 1160,
    minHeight: 715,
    frame: false,
    webPreferences: {
      nodeIntegration: true // 集成 node
    }
  })

  if (process.env.NODE_ENV === 'development') {
    // Importing dev dependencies
    const {
      default: installExtension,
      VUEJS_DEVTOOLS
    } = require('electron-devtools-installer')

    // Installing devtools
    installExtension(VUEJS_DEVTOOLS).then((name: string) => {
      console.log(`Added Extension:  ${name}`)
    }).catch((err: any) => console.log('An error occurred: ', err))

    // Wait for nuxt to build
    const pollServer = () => {
      http.get(winURL, (res) => {
        if (res.statusCode === 200) { if (mainWindow !== null) { mainWindow.loadURL(winURL) } } else { setTimeout(pollServer, 300) }
      }).on('error', pollServer)
    }
    pollServer()

    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(winURL)
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow !== null) {
      mainWindow.webContents.send('')
    }
  })
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

ipcMain.on('close-app', (evt, arg) => {
  app.quit()
})

ipcMain.on('open-dev-tools', (evt, arg) => {
  if (mainWindow === null) { return }
  mainWindow.webContents.openDevTools()
})
