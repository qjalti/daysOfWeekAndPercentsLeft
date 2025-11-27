// const LA = '55.80852';
// const LO = '37.70758';

const LA = "55.81160";
const LO = "37.79113";

window.AUDIO_PLAYED = false;

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const NOW = new Date();
const CURRENT_DAY = NOW.getDay();

const TOTAL_WORK_HOURS = CURRENT_DAY === 5 ? 8 : 9;

const TOTAL_SECONDS = TOTAL_WORK_HOURS * 60 * 60; // 9 часов (8 рабочих часов + 1 обеденных час)

const writeCurrentTimestamp = () => {
  const TIMESTAMP_DIV = document.querySelector("#timestampDiv");
  const TIMESTAMP = Math.floor(Date.now() / 1000);
  TIMESTAMP_DIV.innerHTML = TIMESTAMP.toLocaleString("ru-RU");
};

const writeCurrentTime = () => {
  const TIMESTAMP = new Date();
  window.DAY_OF_WEEK_DIV.innerHTML = TIMESTAMP.toLocaleString("ru-RU", {
    weekday: "short",
  });
  window.TIME_DIV.innerHTML = TIMESTAMP.toLocaleString("ru-RU", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  window.DATE_DIV.innerHTML = TIMESTAMP.toLocaleString("ru-RU", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

const updateTemperature = async () => {
  const OUTDOOR_TEMP_RES = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=02a4a0e085aa4d95a1d90957251905&q=${LA},${LO}`,
    {
      method: "POST",
    },
  );

  let outdoorTemp;
  if (!OUTDOOR_TEMP_RES.ok) {
    outdoorTemp = "Ошибка";
  } else {
    const OUTDOOR_TEMP_JSON = await OUTDOOR_TEMP_RES.json();
    outdoorTemp = OUTDOOR_TEMP_JSON.current.temp_c.toFixed(0);
  }

  const INDOOR_TEMP_RES = await fetch("https://qjalti.ru/api/arduino/select", {
    method: "POST",
  });

  let indoorTemp;
  if (!INDOOR_TEMP_RES.ok) {
    indoorTemp = "Ошибка";
  } else {
    /**
     * Объект с данными по температуре снаружи
     * @const
     * @type {Object} Объект с данными по температуре снаружи
     */
    const INDOOR_TEMP_JSON = await INDOOR_TEMP_RES.json();

    if (INDOOR_TEMP_JSON.data.length) {
      indoorTemp = parseInt(INDOOR_TEMP_JSON.data[0].temperature) + "\u00B0C";
    } else {
      indoorTemp = "!DATA";
    }
  }

  window.OUTDOOR_TEMP_VALUE.innerHTML = outdoorTemp + "\u00B0C";
  window.INDOOR_TEMP_VALUE.innerHTML = indoorTemp;

  /**
   * Temperature text color
   */
  let outdoorTempColor;

  if (outdoorTemp >= 25) {
    outdoorTempColor = "rgba(183, 28, 28, 0.875)";
  }

  if (outdoorTemp <= 24) {
    outdoorTempColor = "rgba(255, 152, 0, 0.875)";
  }

  if (outdoorTemp <= 23) {
    outdoorTempColor = "rgba(255, 193, 7, 0.875)";
  }

  if (outdoorTemp <= 22) {
    outdoorTempColor = "rgba(255, 235, 59, 0.875)";
  }

  if (outdoorTemp <= 21) {
    outdoorTempColor = "rgba(139, 195, 74, 0.875)";
  }

  if (outdoorTemp <= 20) {
    outdoorTempColor = "rgba(76, 175, 80, 0.875)";
  }

  if (outdoorTemp <= 19) {
    outdoorTempColor = "rgba(0, 150, 136, 0.875)";
  }

  if (outdoorTemp <= 19) {
    outdoorTempColor = "rgba(0, 188, 212, 0.875)";
  }
  if (outdoorTemp <= 9) {
    outdoorTempColor = "rgba(3, 169, 244, 0.875)";
  }
  if (outdoorTemp <= 0) {
    outdoorTempColor = "rgba(25, 118, 210, 0.875)";
  }
  if (outdoorTemp <= -10) {
    outdoorTempColor = "rgba(21, 101, 192, 0.875)";
  }
  if (outdoorTemp <= -20) {
    outdoorTempColor = "rgba(13, 71, 161, 0.875)";
  }
  window.OUTDOOR_TEMP_VALUE.style.color = outdoorTempColor;
  window.OT_SVG.style.fill = outdoorTempColor;
};

const updateDayOfWeek = () => {
  const NOW = new Date();

  let colorClass;
  let bgColorClass;

  switch (NOW.getDay()) {
    case 0:
      colorClass = "green";
      bgColorClass = "green-light";
      break;
    case 6:
      colorClass = "green";
      bgColorClass = "green-light";
      break;
    case 1:
      colorClass = "red";
      bgColorClass = "red-light";
      break;
    case 2:
      colorClass = "deepOrange";
      bgColorClass = "deep-orange-light";
      break;
    case 3:
      colorClass = "orange";
      bgColorClass = "orange-light";
      break;
    case 4:
      colorClass = "yellow";
      bgColorClass = "yellow-light";
      break;
    case 5:
      colorClass = "green";
      bgColorClass = "green-light";
      break;
  }

  window.NEW_DOW_DIV.setAttribute("class", "");
  window.NEW_DOW_DIV.classList.add(bgColorClass);
  window.DAY_OF_WEEK_DIV.setAttribute("class", "");
  window.DAY_OF_WEEK_DIV.classList.add(colorClass);
};

document.addEventListener("DOMContentLoaded", () => {
  window.INDOOR_TEMP_VALUE = document.getElementById("indoorTemp");
  window.OUTDOOR_TEMP_VALUE = document.getElementById("outdoorTemp");
  window.CLOSE_BTN = document.getElementById("closeBtn");

  window.NEW_BOX_DIV = document.getElementById("new-box");
  window.NEW_DOW_DIV = document.getElementById("new-DoW");
  window.NEW_PF_DIV = document.getElementById("new-PF");

  window.REFRESH_BTN = document.querySelector("#refreshBtn");

  window.OT_SVG = document.querySelector(".outdoor-temperature-svg");

  window.REFRESH_BTN.addEventListener("click", () => {
    updateDayOfWeek();
    updateTemperature();
    updatePercentsLeft();
    window.MAIN_BOX.classList.remove("grow-in");
    setTimeout(() => {
      window.MAIN_BOX.classList.add("grow-in");
    }, 500);
  });

  window.CLOSE_BTN.addEventListener("click", () => {
    if (
      window.electronAPI &&
      typeof window.electronAPI.closeWindow === "function"
    ) {
      window.electronAPI.closeWindow();
    } else {
      // Fallback: если запущено не в Electron (например, в браузере)
      window.close();
    }
  });

  window.DAY_OF_WEEK_DIV = document.querySelector("#dayOfWeekDiv");
  window.TIME_DIV = document.querySelector("#timeDiv");
  window.DATE_DIV = document.querySelector("#dateDiv");

  window.MAIN_BOX = document.querySelector("#mainBox");

  window.SETTINGS_ICON_SVG = document.getElementById("settingsIcon");
  window.LOTTIE_CONTAINER = document.getElementById("lottieContainer");

  updateDayOfWeek();
  updatePercentsLeft();
  updateTemperature().then(() => false);
  writeCurrentTimestamp();
  writeCurrentTime();
  setInterval(updateDayOfWeek, 4 * 60 * 60 * 1000); // every 4 hours
  setInterval(updatePercentsLeft, 1000);
  setInterval(updateTemperature, 1000 * 60 * 15);
  setInterval(writeCurrentTimestamp, 1000);
  setInterval(writeCurrentTime, 1000);
  setTimeout(() => {
    window.MAIN_BOX.classList.add("grow-in");
  }, 250);

  window.electronAPI.loadLottieAnimation({
    container: document.getElementById("lottieContainer"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "./run-home-from-work.json",
  });
});

function updatePercentsLeft() {
  const NOW = new Date();

  const CURRENT_DAY = NOW.getDay();
  const TARGET_TIME = new Date();
  const WORK_DAY_ENDS_HOURS = CURRENT_DAY === 5 ? 17 : 18;
  TARGET_TIME.setHours(WORK_DAY_ENDS_HOURS, 0, 0, 0);

  const DIFF_MS = TARGET_TIME - NOW;
  const DIFF_MS_TO_SEC = Math.floor(DIFF_MS / 1000);

  let percentsLeft = 100 - (100 * DIFF_MS_TO_SEC) / TOTAL_SECONDS;

  if (percentsLeft > 0) {
    percentsLeft = Number(percentsLeft.toFixed(0));
  }

  let bgColorClassLF = "purple-light";
  let colorClassLF = "purple";
  let showSettingsIcon = false;
  let showLottieContainer = false;
  let lottieClass = "error";

  if (percentsLeft < 0) {
    showLottieContainer = true;
  }

  if (percentsLeft > 100) {
    showLottieContainer = true;
    lottieClass = "success";
  }

  if (percentsLeft >= 0 && percentsLeft <= 100) {
    showSettingsIcon = true;
  }

  if (percentsLeft >= 0 && percentsLeft < 20) {
    bgColorClassLF = "red-light";
    colorClassLF = "red";
  }

  if (percentsLeft >= 20 && percentsLeft < 40) {
    bgColorClassLF = "deep-orange-light";
    colorClassLF = "deepOrange";
  }

  if (percentsLeft >= 40 && percentsLeft < 60) {
    bgColorClassLF = "orange-light";
    colorClassLF = "orange";
  }

  if (percentsLeft >= 60 && percentsLeft < 87) {
    bgColorClassLF = "yellow-light";
    colorClassLF = "yellow";
  }

  if (percentsLeft >= 87 && percentsLeft <= 100) {
    bgColorClassLF = "green-light";
    colorClassLF = "green";
  }

  if (percentsLeft >= 85 && percentsLeft <= 88) {
    if (!window.AUDIO_PLAYED) {
      window.electronAPI.playSound();
      window.AUDIO_PLAYED = true;
    }
  }

  if (percentsLeft >= 1 && percentsLeft <= 3) {
    window.AUDIO_PLAYED = false;
  }

  if (showLottieContainer) {
    window.SETTINGS_ICON_SVG.style.display = "none";
    window.LOTTIE_CONTAINER.style.display = "block";
  }

  if (showSettingsIcon) {
    window.SETTINGS_ICON_SVG.style.display = "block";
    window.LOTTIE_CONTAINER.style.display = "none";
  }

  if (lottieClass === "error") {
    window.LOTTIE_CONTAINER.classList.remove("success");
    window.LOTTIE_CONTAINER.classList.add(lottieClass);
  } else {
    window.LOTTIE_CONTAINER.classList.remove("error");
    window.LOTTIE_CONTAINER.classList.add(lottieClass);
  }

  window.NEW_PF_DIV.setAttribute("class", "");
  window.NEW_PF_DIV.classList.add(bgColorClassLF);
  window.TIME_DIV.setAttribute("class", "");
  window.TIME_DIV.classList.add(colorClassLF);
}
