const listDiv = document.getElementById('ai-list');
const addBtn = document.getElementById('add');

async function render() {
  listDiv.innerHTML = '';
  const { ais = [] } = await chrome.storage.local.get("ais");
  
  ais.forEach((ai, i) => {
    const item = document.createElement('div');
    item.style = "border:1px solid #ddd; padding:12px; margin-bottom:10px; border-radius:8px; background:#fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:start;">
        <div>
          <strong style="font-size:1.1em;">${ai.name}</strong><br>
          <small style="color:#666;">${ai.url}</small>
        </div>
        <button class="del-btn" style="background:#ff4d4f; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">削除</button>
      </div>
      <div style="margin-top:8px; font-size:0.9em; background:#f5f5f5; padding:8px; border-radius:4px;">
        <code>Selector: ${ai.selector}</code><br>
        <span style="color:#888;">Prefix: ${ai.prefix || '(なし)'}</span>
      </div>
    `;

    item.querySelector('.del-btn').onclick = async () => {
      ais.splice(i, 1);
      await chrome.storage.local.set({ ais });
      render();
    };
    listDiv.appendChild(item);
  });
}

addBtn.onclick = async () => {
  const fields = ['name', 'url', 'selector', 'prefix'];
  const values = {};
  fields.forEach(f => values[f] = document.getElementById(f).value);

  if (!values.name || !values.url || !values.selector) return alert("必須項目を埋めてください");

  const { ais = [] } = await chrome.storage.local.get("ais");
  ais.push(values);
  await chrome.storage.local.set({ ais });

  fields.forEach(f => document.getElementById(f).value = '');
  render();
};

render();