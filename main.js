const {app, BrowserWindow} = require('electron');

let win;

app.on('ready', () => {
  win = new BrowserWindow({
    width: 256 - (8 * 4),
    height: 128 - (8 * 4),
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    hasShadow: false,
    movable: true,
    focusable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Обязательно для работы с DOM
    },
  });

  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'Escape') {
      win.close();
    }
  });

  win.loadFile('index.html').then(() => false);
});