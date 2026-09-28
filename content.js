const STYLE_ID = "custom-dark-mode-style";

function escapeRegExp(string) {
  return string.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&");
}

function matchesUrlPattern(pattern, fullUrl, host) {
  if (!pattern) return false;
  pattern = pattern.trim();
  if (!pattern) return false;

  let targetUrl = fullUrl.replace(/^https?:\/\//i, "");
  let cleanPattern = pattern.replace(/^https?:\/\//i, "");

  if (!cleanPattern.includes("/")) {
    cleanPattern += "/*";
  } else if (cleanPattern.endsWith("/")) {
    cleanPattern += "*";
  }

  let regexStr;
  if (cleanPattern.startsWith("*.")) {
    const base = cleanPattern.slice(2);
    const escapedBase = escapeRegExp(base).replace(/\*/g, ".*");
    regexStr = "^(?:.*\\.)?" + escapedBase + "$";
  } else {
    regexStr = "^" + escapeRegExp(cleanPattern).replace(/\*/g, ".*") + "$";
  }

  const regex = new RegExp(regexStr, "i");

  if (regex.test(targetUrl)) return true;

  const targetUrlNoQuery = targetUrl.split("?")[0].split("#")[0];
  if (regex.test(targetUrlNoQuery)) return true;

  if (host && regex.test(host)) return true;

  return false;
}

function applyTheme() {
  chrome.storage.sync.get(
    {
      enabled: true,
      applyAll: false,
      mode: "custom",
      bgColor: "#121212",
      textColor: "#e0e0e0",
      urls: [],
      ignoredUrls: []
    },
    (config) => {
      const currentUrl = window.location.href;
      const currentHost = window.location.hostname;

      const isIgnored = config.ignoredUrls.some((pattern) =>
        matchesUrlPattern(pattern, currentUrl, currentHost)
      );
      const isUrlListed = config.urls.some((pattern) =>
        matchesUrlPattern(pattern, currentUrl, currentHost)
      );

      // Regra de execução: precisa estar ativado, NÃO estar ignorado, e (ser global OU estar na lista de ativos)
      const shouldApply = config.enabled && !isIgnored && (config.applyAll || isUrlListed);

      let styleEl = document.getElementById(STYLE_ID);

      if (!shouldApply) {
        if (styleEl) styleEl.remove();
        return;
      }

      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(styleEl);
      }

      if (config.mode === "invert") {
        styleEl.textContent = `
          html {
            filter: invert(90%) hue-rotate(180deg) !important;
            background-color: #121212 !important;
          }
          img, video, canvas, picture, svg {
            filter: invert(100%) hue-rotate(180deg) !important;
          }
        `;
      } else {
        styleEl.textContent = `
          html, body, main, section, article, header, nav, footer, aside,
          div[class*="container"], div[class*="content"], div[class*="wrapper"] {
            background-color: ${config.bgColor} !important;
            color: ${config.textColor} !important;
          }
          input, textarea, select, button {
            background-color: #1e1e1e !important;
            color: ${config.textColor} !important;
            border-color: #444 !important;
          }
          p, span, h1, h2, h3, h4, h5, h6, li, a, td, th, blockquote, label {
            color: ${config.textColor} !important;
          }
          img, video, canvas, svg {
            filter: brightness(0.9) contrast(1.1);
          }
        `;
      }
    }
  );
}

applyTheme();

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "update_theme") {
    applyTheme();
  }
});