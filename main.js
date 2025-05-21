const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  ipcMain,
  Notification
} = require('electron');

const PATH = require('path');
const {exec} = require('child_process');
const player = require('node-wav-player');

const PATH_TO_ICON = './assets/icon.ico';
const PATH_TO_TRAY_ICON = './assets/tray_icon.ico';

let win;
let tray = null;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 256 + (8 * 32),
    height: 128 - (8 * 11),
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    hasShadow: false,
    movable: true,
    focusable: true,
    icon: nativeImage.createFromPath(PATH_TO_ICON),
    backgroundMaterial: 'acrylic',
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: PATH.join(__dirname, 'preload.js'),
    },
  });
  // win.webContents.openDevTools();

  tray = new Tray(nativeImage.createFromPath(PATH_TO_TRAY_ICON));

  const CONTEXT_MENU = Menu.buildFromTemplate([
    {
      label: 'Exit',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('daysOfWeekAndPercentsLeft');
  tray.setContextMenu(CONTEXT_MENU);

  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'Escape') {
      win.close();
    }
  });

  win.loadFile('index.html').then(() => false);
});


ipcMain.on('play-sound', () => {
  playSound();
});

const playSound = () => {
  const soundPath = PATH.join(__dirname, 'assets/todo.wav');

  if (process.platform === 'win32') {
    player.play({path: soundPath}).catch(err => console.error('Ошибка воспроизведения:', err));
  } else if (process.platform === 'darwin') {
    exec(`afplay "${soundPath}"`);
  } else {
    exec(`aplay "${soundPath}"`);
  }
  showNotification();
}

const showNotification = () => {
  const notif = new Notification({
    title: '████████',
    body: '██ █████ ████████ ███ < 1H'
  });
  notif.show();
}