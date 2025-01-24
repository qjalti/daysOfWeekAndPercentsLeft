const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage
} = require('electron');

const PATH_TO_ICON = './counter.ico';

let win;
let tray = null;

app.whenReady().then(() => {
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
    icon: nativeImage.createFromPath(PATH_TO_ICON),
    backgroundMaterial: 'acrylic',
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Обязательно для работы с DOM
    },
  });

  tray = new Tray(nativeImage.createFromPath(PATH_TO_ICON));

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