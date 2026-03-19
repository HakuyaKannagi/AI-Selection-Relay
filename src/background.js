const DEFAULT_AIS = [
  {
    name: "Gemini（要約）",
    url: "https://gemini.google.com/app",
    selector: "div.ql-editor",
    prefix: "以下の文章を要約して："
  },
  {
    name: "ChatGPT（要約）",
    url: "https://chatgpt.com/",
    selector: "[name='prompt-textarea']",
    prefix: "以下の文章を要約して："
  }
];

let isUpdating = false;

async function updateMenus() {
  if (isUpdating) return;
  isUpdating = true;
  chrome.contextMenus.removeAll(async () => {
    const { ais = [] } = await chrome.storage.local.get("ais");
    const ts = Date.now();
    ais.forEach((ai, index) => {
      chrome.contextMenus.create({
        id: `ai-${index}-${ts}-${Math.floor(Math.random() * 1000)}`,
        title: `${ai.name} に送る`,
        contexts: ["selection"]
      });
    });
    setTimeout(() => { isUpdating = false; }, 300);
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const { ais } = await chrome.storage.local.get("ais");
  if (!ais || ais.length === 0) {
    await chrome.storage.local.set({ ais: DEFAULT_AIS });
  }
  updateMenus();
});

chrome.storage.onChanged.addListener(updateMenus);

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) return;

  const match = info.menuItemId.match(/^ai-(\d+)-/);
  if (!match) return;

  const index = parseInt(match[1]);
  const { ais = [] } = await chrome.storage.local.get("ais");
  const targetAi = ais[index];
  if (!targetAi) return;

  try {
    const scriptResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    });
    
    const realSelectedText = scriptResult[0]?.result;
    if (!realSelectedText || realSelectedText.trim() === "") return;

    const combinedText = (targetAi.prefix ? targetAi.prefix + "\n" : "") + realSelectedText;
    const newTab = await chrome.tabs.create({ url: targetAi.url });

    const injectListener = (tabId, changeInfo) => {
      if (tabId === newTab.id && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(injectListener);

        chrome.scripting.executeScript({
          target: { tabId: newTab.id },
          func: (text, selector) => {
            let attempts = 0;
            const timer = setInterval(() => {
              const el = document.querySelector(selector);
              if (el) {
                clearInterval(timer);
                el.focus();

                if (el.isContentEditable) el.innerText = "";
                else el.value = "";

                document.execCommand('insertText', false, text);

                if ((el.isContentEditable ? el.innerText : el.value).length === 0) {
                   if (el.isContentEditable) el.innerText = text;
                   else el.value = text;
                }

                ['input', 'change', 'keyup'].forEach(type => {
                  el.dispatchEvent(new Event(type, { bubbles: true }));
                });
              }
              if (++attempts > 30) clearInterval(timer);
            }, 500);
          },
          args: [combinedText, targetAi.selector]
        });
      }
    };
    chrome.tabs.onUpdated.addListener(injectListener);
  } catch (err) {
    console.error(err);
  }
});