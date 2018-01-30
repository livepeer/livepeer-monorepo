const { app, dialog, BrowserWindow, Menu, MenuItem } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

const APP_TITLE = 'Livepeer Protocol Explorer'

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: APP_TITLE,
    width: 960,
    height: 800,
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../../build/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  )

  mainWindow.webContents.on('crashed', () => {
    const options = {
      type: 'info',
      title: `${name} Renderer Process Crashed`,
      message: 'This process has crashed.',
      buttons: ['Reload', 'Close'],
    }
    dialog.showMessageBox(options, i => (i === 0 ? w.reload() : w.close()))
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        {
          label: APP_TITLE,
          submenu: [{ role: 'quit' }],
        },
        {
          label: 'Edit',
          submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            { role: 'selectall' },
          ],
        },
        {
          label: 'View',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
          ],
        },
      ]),
    )
  }
}

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())
