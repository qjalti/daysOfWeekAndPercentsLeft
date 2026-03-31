const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  ipcMain,
} = require("electron");

const path = require("path");
const { exec } = require("child_process");
const player = require("node-wav-player");

const PATH_TO_ICON = "./assets/icon.ico";
const PATH_TO_TRAY_ICON = "./assets/tray_icon.ico";
const ARROW_STEP = 1;

let win;
let tray = null;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 800,
    height: 32,
    frame: false,
    alwaysOnTop: false,
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
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setAlwaysOnTop(true, "screen-saver");

  tray = new Tray(path.join(__dirname, PATH_TO_TRAY_ICON));

  const CONTEXT_MENU = Menu.buildFromTemplate([
    {
      label: "Закрыть",
      type: "normal",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Инфо-панель Кьялти");
  tray.setContextMenu(CONTEXT_MENU);

  win.webContents.on("before-input-event", (event, input) => {
    if (input.type !== "keyDown") return;

    const bounds = win.getBounds();

    switch (input.key) {
      case "ArrowLeft":
        win.setBounds({ x: bounds.x - ARROW_STEP, y: bounds.y });
        break;
      case "ArrowRight":
        win.setBounds({ x: bounds.x + ARROW_STEP, y: bounds.y });
        break;
      case "ArrowUp":
        win.setBounds({ x: bounds.x, y: bounds.y - ARROW_STEP });
        break;
      case "ArrowDown":
        win.setBounds({ x: bounds.x, y: bounds.y + ARROW_STEP });
        break;
      case "Escape":
        win.close();
        break;
    }
  });

  win.loadFile("index.html");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("close-window", (event) => {
  const targetWin = BrowserWindow.fromWebContents(event.sender);
  if (targetWin) targetWin.close();
});

ipcMain.on("play-sound", () => {
  playSound();
});

const playSound = () => {
  const soundPath = app.isPackaged
    ? path.join(
        process.resourcesPath,
        "app.asar.unpacked",
        "assets",
        "todo.wav",
      )
    : path.join(__dirname, "assets", "todo.wav");

  if (process.platform === "win32") {
    player.play({ path: soundPath }).catch((err) => {
      console.error("Ошибка воспроизведения звука:", err);
    });
  } else if (process.platform === "darwin") {
    exec(`afplay "${soundPath}"`, (err) => {
      if (err) console.error("Ошибка воспроизведения звука:", err);
    });
  } else {
    exec(`aplay "${soundPath}"`, (err) => {
      if (err) console.error("Ошибка воспроизведения звука:", err);
    });
  }
};
