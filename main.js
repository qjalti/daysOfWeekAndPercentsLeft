const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  ipcMain,
} = require("electron");

const PATH = require("path");
const { exec } = require("child_process");
const player = require("node-wav-player");

const PATH_TO_ICON = "./assets/icon.ico";
const PATH_TO_TRAY_ICON = "./assets/tray_icon.ico";

let win;
let tray = null;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 640,
    height: 32,
    // width: 1920,
    // height: 1080,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    hasShadow: false,
    movable: true,
    focusable: true,
    icon: nativeImage.createFromPath(PATH_TO_ICON),
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: PATH.join(__dirname, "preload.js"),
    },
  });
  // win.webContents.openDevTools();

  tray = new Tray(PATH.join(__dirname, PATH_TO_TRAY_ICON));

  const CONTEXT_MENU = Menu.buildFromTemplate([
    {
      label: "Exit",
      type: "normal",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("daysOfWeekAndPercentsLeft");
  tray.setContextMenu(CONTEXT_MENU);

  win.webContents.on("before-input-event", (event, input) => {
    const step = 1;
    const bounds = win.getBounds();

    if (input.type === "keyDown") {
      switch (input.key) {
        case "ArrowLeft":
          win.setBounds({ x: bounds.x - step, y: bounds.y });
          break;
        case "ArrowRight":
          win.setBounds({ x: bounds.x + step, y: bounds.y });
          break;
        case "ArrowUp":
          win.setBounds({ x: bounds.x, y: bounds.y - step });
          break;
        case "ArrowDown":
          win.setBounds({ x: bounds.x, y: bounds.y + step });
          break;
      }
    }

    if (input.type === "keyDown" && input.key === "Escape") {
      win.close();
    }
  });

  win.loadFile("index.html").then(() => false);
});

ipcMain.on("close-window", (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win) win.close();
});

ipcMain.on("play-sound", () => {
  playSound();
});

const playSound = () => {
  const soundPath = app.isPackaged
    ? PATH.join(
        process.resourcesPath,
        "app.asar.unpacked",
        "assets",
        "todo.wav",
      )
    : PATH.join(__dirname, "assets", "todo.wav");

  if (process.platform === "win32") {
    player.play({ path: soundPath }).catch((err) => {
      console.error("Ошибка воспроизведения звука:", err);
    });
  } else if (process.platform === "darwin") {
    exec(`afplay "${soundPath}"`);
  } else {
    exec(`aplay "${soundPath}"`);
  }
};
