const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
} = require('electron');

const PATH_TO_ICON = './assets/icon.ico';
const PATH_TO_TRAY_ICON = './assets/tray_icon.ico';

let win;
let tray = null;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 256 - (6 * 18),
    height: 128 - (6 * 14),
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
      contextIsolation: false,
    },
  });

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