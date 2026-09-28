const defaultSettings = {
  enabled: true,
  applyAll: false,
  mode: "custom",
  bgColor: "#121212",
  textColor: "#e0e0e0",
  urls: [],
  ignoredUrls: []
};

let currentTab = null;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTab = tabs[0];
  const urlInput = document.getElementById("urlInput");
  if (urlInput && currentTab?.url) {
    const defaultPattern = getDefaultPattern(currentTab.url);
    if (defaultPattern) {
      urlInput.value = defaultPattern;
    }
  }
  loadSettings();
});

function getDefaultPattern(urlStr) {
  if (!urlStr) return "";
  try {
    const urlObj = new URL(urlStr);
    if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
      return `${urlObj.hostname}/*`;
    }
  } catch {}
  return "";
}

function loadSettings() {
  chrome.storage.sync.get(defaultSettings, (data) => {
    document.getElementById("enableExtension").checked = data.enabled;
    document.getElementById("applyAll").checked = data.applyAll;
    document.getElementById("mode").value = data.mode;
    document.getElementById("bgColor").value = data.bgColor;
    document.getElementById("textColor").value = data.textColor;

    toggleColorGroup(data.mode);
    renderList("activeList", data.urls, "urls");
    renderList("ignoredList", data.ignoredUrls, "ignoredUrls");
  });
}

function toggleColorGroup(mode) {
  const group = document.getElementById("customColorsGroup");
  if (mode === "invert") {
    group.classList.add("disabled-group");
  } else {
    group.classList.remove("disabled-group");
  }
}

function saveSettings(notify = true) {
  const currentMode = document.getElementById("mode").value;
  toggleColorGroup(currentMode);

  const settings = {
    enabled: document.getElementById("enableExtension").checked,
    applyAll: document.getElementById("applyAll").checked,
    mode: currentMode,
    bgColor: document.getElementById("bgColor").value,
    textColor: document.getElementById("textColor").value
  };

  chrome.storage.sync.set(settings, () => {
    if (notify && currentTab?.id) {
      chrome.tabs.sendMessage(currentTab.id, { action: "update_theme" }).catch(() => {});
    }
  });
}

// Ouvintes de inputs gerais
document.getElementById("enableExtension").addEventListener("change", () => saveSettings());
document.getElementById("applyAll").addEventListener("change", () => saveSettings());
document.getElementById("mode").addEventListener("change", () => saveSettings());
document.getElementById("bgColor").addEventListener("input", () => saveSettings());
document.getElementById("textColor").addEventListener("input", () => saveSettings());

// Alternância de abas
const tabActive = document.getElementById("tabActive");
const tabIgnored = document.getElementById("tabIgnored");
const activeList = document.getElementById("activeList");
const ignoredList = document.getElementById("ignoredList");

tabActive.addEventListener("click", () => {
  tabActive.classList.add("active");
  tabIgnored.classList.remove("active");
  activeList.style.display = "block";
  ignoredList.style.display = "none";
});

tabIgnored.addEventListener("click", () => {
  tabIgnored.classList.add("active");
  tabActive.classList.remove("active");
  activeList.style.display = "none";
  ignoredList.style.display = "block";
});

// Adicionar padrão à lista
document.getElementById("addCurrentActive").addEventListener("click", () => {
  addPatternToList("urls", "ignoredUrls");
});

document.getElementById("addCurrentIgnored").addEventListener("click", () => {
  addPatternToList("ignoredUrls", "urls");
});

document.getElementById("urlInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addPatternToList("urls", "ignoredUrls");
  }
});

function addPatternToList(targetKey, oppositeKey) {
  const urlInput = document.getElementById("urlInput");
  let pattern = urlInput ? urlInput.value.trim() : "";

  if (!pattern && currentTab?.url) {
    pattern = getDefaultPattern(currentTab.url);
  }

  if (!pattern) return;

  chrome.storage.sync.get({ urls: [], ignoredUrls: [] }, (data) => {
    let targetList = data[targetKey] || [];
    let oppositeList = (data[oppositeKey] || []).filter((item) => item !== pattern);

    if (!targetList.includes(pattern)) {
      targetList.push(pattern);
    }

    chrome.storage.sync.set({ [targetKey]: targetList, [oppositeKey]: oppositeList }, () => {
      chrome.storage.sync.get({ urls: [], ignoredUrls: [] }, (updatedData) => {
        renderList("activeList", updatedData.urls, "urls");
        renderList("ignoredList", updatedData.ignoredUrls, "ignoredUrls");
        saveSettings();
      });
    });
  });
}

// Renderização genérica para ambas as listas
function renderList(elementId, items, storageKey) {
  const list = document.getElementById(elementId);
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = '<li class="empty-msg">Nenhum site na lista</li>';
    return;
  }

  items.forEach((item, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = item;
    span.style.flex = "1";
    span.style.wordBreak = "break-all";

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.className = "del-btn";
    delBtn.title = "Excluir";
    delBtn.addEventListener("click", () => {
      items.splice(index, 1);
      chrome.storage.sync.set({ [storageKey]: items }, () => {
        renderList(elementId, items, storageKey);
        saveSettings();
      });
    });

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}