# 📋 看板设置面板实现方案

> 目标：为 `我的笔记看板.md` 添加可视化设置面板，用户无需手改代码即可配置所有可定制选项。

---

## 一、DEFAULT_CONFIG 对象结构

在 `C` 对象定义之前（约第 15 行前）插入：

```javascript
const DEFAULT_CONFIG = {
    exclude: ['附件', '模板', 'copilot'],   // 排除文件夹
    planPath: 'planning/成长计划.md',         // 成长计划路径
    heatLevels: [400, 1200, 2500],           // 热力图阈值 [低, 中, 高]
    heatWeeks: 54,                           // 热力图显示周数
    monthCount: 12,                          // 月度统计月数
    dayCount: 7,                             // 近N天统计天数
    folderTopN: 5,                           // 文件夹排行显示数量
    maxOpen: 3,                              // 待办默认展开组数
    taskTags: ['#important', '#urgent', '#doing', '#wip', '#进行中', '#review', '#待回顾'], // 任务优先级标签
    dueEmoji: '📅',                          // 截止日期标记
    estThreshold: 200,                       // 词数估算阈值（笔记数 > 此值时用 file.size 估算）
    estCoeff: 4,                             // 估算系数（file.size / 此值 ≈ 词数）
    colorScheme: 'indigo',                   // 配色方案名
};

// 配色方案预设
const COLOR_SCHEMES = {
    indigo:  { primary: '#6366f1', accent: '#8b5cf6', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', tag: '#6366f1', bar: ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd','#a5b4fc','#818cf8','#6d28d9','#4f46e5'] },
    emerald: { primary: '#10b981', accent: '#34d399', gradient: 'linear-gradient(135deg,#10b981,#34d399)', tag: '#10b981', bar: ['#10b981','#34d399','#6ee7b7','#a7f3d0','#059669','#047857','#065f46','#064e3b'] },
    amber:   { primary: '#f59e0b', accent: '#fbbf24', gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)', tag: '#f59e0b', bar: ['#f59e0b','#fbbf24','#fcd34d','#fde68a','#d97706','#b45309','#92400e','#78350f'] },
    rose:    { primary: '#f43f5e', accent: '#fb7185', gradient: 'linear-gradient(135deg,#f43f5e,#fb7185)', tag: '#f43f5e', bar: ['#f43f5e','#fb7185','#fda4af','#fecdd3','#e11d48','#be123c','#9f1239','#881337'] },
    slate:   { primary: '#64748b', accent: '#94a3b8', gradient: 'linear-gradient(135deg,#64748b,#94a3b8)', tag: '#64748b', bar: ['#64748b','#94a3b8','#cbd5e1','#e2e8f0','#475569','#334155','#1e293b','#0f172a'] },
};
```

**设计要点**：
- `heatLevels` 长度固定为 3，对应等级 1/2/3 的阈值上限（等级 4 = 超过最高值）
- `colorScheme` 存储方案名（字符串），渲染时查表取色值
- `COLOR_SCHEMES` 作为只读常量，不存入 frontmatter

---

## 二、loadConfig() / saveToFrontmatter() 函数

### 2.1 loadConfig()

```javascript
function loadConfig() {
    const fm = dv.current()?.file?.frontmatter;
    const cfg = { ...DEFAULT_CONFIG };
    if (!fm) return cfg;

    // 逐字段覆盖：类型校验 + 回退默认值
    if (Array.isArray(fm.exclude) && fm.exclude.length > 0) cfg.exclude = fm.exclude;
    if (typeof fm.planPath === 'string' && fm.planPath) cfg.planPath = fm.planPath;
    if (Array.isArray(fm.heatLevels) && fm.heatLevels.length === 3 && fm.heatLevels.every(n => typeof n === 'number'))
        cfg.heatLevels = [...fm.heatLevels].sort((a, b) => a - b);
    if (typeof fm.heatWeeks === 'number' && fm.heatWeeks >= 10 && fm.heatWeeks <= 104) cfg.heatWeeks = Math.round(fm.heatWeeks);
    if (typeof fm.monthCount === 'number' && fm.monthCount >= 1 && fm.monthCount <= 24) cfg.monthCount = Math.round(fm.monthCount);
    if (typeof fm.dayCount === 'number' && fm.dayCount >= 1 && fm.dayCount <= 30) cfg.dayCount = Math.round(fm.dayCount);
    if (typeof fm.folderTopN === 'number' && fm.folderTopN >= 1 && fm.folderTopN <= 50) cfg.folderTopN = Math.round(fm.folderTopN);
    if (typeof fm.maxOpen === 'number' && fm.maxOpen >= 0 && fm.maxOpen <= 20) cfg.maxOpen = Math.round(fm.maxOpen);
    if (Array.isArray(fm.taskTags)) cfg.taskTags = fm.taskTags.filter(t => typeof t === 'string');
    if (typeof fm.dueEmoji === 'string' && fm.dueEmoji) cfg.dueEmoji = fm.dueEmoji;
    if (typeof fm.estThreshold === 'number' && fm.estThreshold > 0) cfg.estThreshold = Math.round(fm.estThreshold);
    if (typeof fm.estCoeff === 'number' && fm.estCoeff > 0) cfg.estCoeff = fm.estCoeff;
    if (typeof fm.colorScheme === 'string' && COLOR_SCHEMES[fm.colorScheme]) cfg.colorScheme = fm.colorScheme;

    return cfg;
}
```

### 2.2 saveToFrontmatter()

```javascript
async function saveToFrontmatter(newCfg) {
    const file = app.vault.getAbstractFileByPath(C.selfPath);
    if (!file) throw new Error('找不到当前文件');

    await app.fileManager.processFrontMatter(file, fm => {
        // 只写入与默认值不同的字段（保持 frontmatter 精简）
        for (const [key, defVal] of Object.entries(DEFAULT_CONFIG)) {
            const val = newCfg[key];
            if (JSON.stringify(val) !== JSON.stringify(defVal)) {
                fm[key] = val;
            } else {
                delete fm[key]; // 恢复默认时删除字段
            }
        }
    });
}
```

**关键机制**：`app.fileManager.processFrontMatter()` 是 Obsidian 官方 API（v0.15+），原子性读写 YAML frontmatter，不破坏正文内容。写入后 Obsidian 自动触发 Dataview 重渲染。

---

## 三、设置面板 HTML/CSS 结构

### 3.1 齿轮图标入口

在仪表板 header 区域（约第 425 行热力图标题旁）添加：

```javascript
// 在 H.push('<div class="nd-title">🔥 近一年贡献热力图</div>'); 之前插入
const gearBtnId = 'nd-gear-' + Date.now();
H.push(`<div style="display:flex;align-items:center;justify-content:space-between;">`);
H.push(`<div class="nd-title">🔥 近一年贡献热力图</div>`);
H.push(`<button id="${gearBtnId}" style="background:none;border:none;cursor:pointer;font-size:18px;padding:4px 8px;border-radius:6px;color:var(--text-muted);transition:all .2s;" title="看板设置">⚙️</button>`);
H.push(`</div>`);
```

### 3.2 设置面板容器

在 `#nd-dash` 内、所有卡片之前插入面板壳（初始隐藏）：

```javascript
const panelId = 'nd-settings-' + Date.now();
const overlayId = 'nd-overlay-' + Date.now();

// 遮罩层 + 面板
H.push(`<div id="${overlayId}" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:998;backdrop-filter:blur(2px);"></div>`);
H.push(`<div id="${panelId}" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999;`
    + `width:min(92vw,480px);max-height:85vh;overflow-y:auto;background:var(--background-primary);`
    + `border:1px solid var(--background-modifier-border);border-radius:16px;`
    + `box-shadow:0 20px 60px rgba(0,0,0,.25);padding:0;font-size:13px;">`
    + `</div>`);
```

### 3.3 面板内部结构（完整 HTML 生成函数）

```javascript
function buildSettingsPanelHTML(cfg) {
    const scheme = COLOR_SCHEMES[cfg.colorScheme] || COLOR_SCHEMES.indigo;
    let h = '';

    // ── 顶栏 ──
    h += `<div style="position:sticky;top:0;z-index:1;background:var(--background-primary);padding:16px 20px 12px;border-bottom:1px solid var(--background-modifier-border);border-radius:16px 16px 0 0;">`;
    h += `<div style="display:flex;align-items:center;justify-content:space-between;">`;
    h += `<span style="font-size:16px;font-weight:700;">⚙️ 看板设置</span>`;
    h += `<button data-nd-action="close" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--text-muted);padding:4px 8px;border-radius:6px;">✕</button>`;
    h += `</div></div>`;

    // ── 表单体 ──
    h += `<div style="padding:16px 20px 20px;">`;

    // ===== 区块 1：配色方案 =====
    h += sectionTitle('🎨 配色方案');
    h += `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">`;
    for (const [name, sc] of Object.entries(COLOR_SCHEMES)) {
        const active = name === cfg.colorScheme;
        h += `<label data-nd-scheme="${name}" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:10px;cursor:pointer;`
            + `border:2px solid ${active ? sc.primary : 'var(--background-modifier-border)'};`
            + `background:${active ? sc.primary + '12' : 'var(--background-secondary)'};transition:all .2s;">`;
        h += `<input type="radio" name="nd-color" value="${name}" ${active ? 'checked' : ''} style="display:none;">`;
        // 色块预览
        h += `<span style="display:flex;gap:2px;">`;
        for (let i = 0; i < 3; i++) {
            h += `<span style="width:12px;height:12px;border-radius:3px;background:${sc.bar[i]};"></span>`;
        }
        h += `</span>`;
        h += `<span style="font-size:11px;font-weight:${active ? 700 : 400};color:${active ? sc.primary : 'var(--text-muted)'};">${name}</span>`;
        h += `</label>`;
    }
    h += `</div>`;

    // ===== 区块 2：排除文件夹（chip 输入） =====
    h += sectionTitle('📁 排除文件夹');
    h += chipInput('exclude', cfg.exclude, '输入文件夹名，回车添加');

    // ===== 区块 3：成长计划路径 =====
    h += sectionTitle('🌱 成长计划路径');
    h += textInput('planPath', cfg.planPath, 'planning/成长计划.md');

    // ===== 区块 4：热力图 =====
    h += sectionTitle('🔥 热力图');
    h += `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">`;
    h += numberInput('heatLevels[0]', cfg.heatLevels[0], '低阈值', 50, 5000);
    h += numberInput('heatLevels[1]', cfg.heatLevels[1], '中阈值', 100, 10000);
    h += numberInput('heatLevels[2]', cfg.heatLevels[2], '高阈值', 200, 50000);
    h += `</div>`;
    h += numberInput('heatWeeks', cfg.heatWeeks, '显示周数', 10, 104);

    // ===== 区块 5：统计范围 =====
    h += sectionTitle('📊 统计范围');
    h += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">`;
    h += numberInput('monthCount', cfg.monthCount, '月度统计月数', 1, 24);
    h += numberInput('dayCount', cfg.dayCount, '近N天统计', 1, 30);
    h += `</div>`;

    // ===== 区块 6：显示偏好 =====
    h += sectionTitle('👁️ 显示偏好');
    h += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">`;
    h += numberInput('folderTopN', cfg.folderTopN, '文件夹排行数量', 1, 50);
    h += numberInput('maxOpen', cfg.maxOpen, '待办默认展开组数', 0, 20);
    h += `</div>`;

    // ===== 区块 7：任务标签（chip 输入） =====
    h += sectionTitle('🏷️ 任务优先级标签');
    h += chipInput('taskTags', cfg.taskTags, '输入标签如 #important，回车添加');

    // ===== 区块 8：截止日期 & 估算 =====
    h += sectionTitle('⚙️ 其他');
    h += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">`;
    h += textInput('dueEmoji', cfg.dueEmoji, '📅');
    h += numberInput('estThreshold', cfg.estThreshold, '估算阈值（笔记数）', 50, 1000);
    h += `</div>`;
    h += numberInput('estCoeff', cfg.estCoeff, '估算系数', 1, 20);

    h += `</div>`; // end form body

    // ── 底栏按钮 ──
    h += `<div style="position:sticky;bottom:0;background:var(--background-primary);padding:12px 20px;border-top:1px solid var(--background-modifier-border);border-radius:0 0 16px 16px;display:flex;gap:8px;justify-content:flex-end;">`;
    h += `<button data-nd-action="reset" style="padding:8px 16px;border-radius:8px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-muted);cursor:pointer;font-size:12px;">恢复默认</button>`;
    h += `<button data-nd-action="save" style="padding:8px 20px;border-radius:8px;border:none;background:${scheme.gradient};color:#fff;cursor:pointer;font-size:12px;font-weight:600;box-shadow:0 2px 8px ${scheme.primary}40;">保存</button>`;
    h += `</div>`;

    return h;
}
```

### 3.4 辅助 UI 组件函数

```javascript
function sectionTitle(text) {
    return `<div style="font-size:12px;font-weight:600;color:var(--text-normal);margin:14px 0 8px;padding-bottom:4px;border-bottom:1px solid var(--background-modifier-border);">${text}</div>`;
}

function textInput(name, value, placeholder) {
    return `<input type="text" data-nd-field="${name}" value="${esc(value)}" placeholder="${esc(placeholder)}" `
        + `style="width:100%;padding:7px 10px;border-radius:8px;border:1px solid var(--background-modifier-border);`
        + `background:var(--background-secondary);color:var(--text-normal);font-size:12px;box-sizing:border-box;margin-bottom:8px;">`;
}

function numberInput(name, value, label, min, max) {
    return `<div style="margin-bottom:8px;">`
        + `<label style="font-size:10px;color:var(--text-muted);display:block;margin-bottom:2px;">${label}</label>`
        + `<input type="number" data-nd-field="${name}" value="${value}" min="${min}" max="${max}" `
        + `style="width:100%;padding:7px 10px;border-radius:8px;border:1px solid var(--background-modifier-border);`
        + `background:var(--background-secondary);color:var(--text-normal);font-size:12px;box-sizing:border-box;">`
        + `</div>`;
}

function chipInput(name, values, placeholder) {
    let h = `<div data-nd-chip="${name}" style="display:flex;flex-wrap:wrap;gap:4px;padding:6px 8px;border-radius:8px;`
        + `border:1px solid var(--background-modifier-border);background:var(--background-secondary);margin-bottom:8px;min-height:36px;align-items:center;cursor:text;">`;
    values.forEach((v, i) => {
        h += `<span data-nd-chip-val="${i}" style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;`
            + `border-radius:6px;background:var(--interactive-accent);color:#fff;font-size:11px;font-weight:500;`
            + `animation:ndPopIn .2s ease-out;">`
            + `<span>${esc(v)}</span>`
            + `<span data-nd-chip-del="${i}" style="cursor:pointer;font-size:13px;line-height:1;opacity:.7;">×</span>`
            + `</span>`;
    });
    h += `<input type="text" data-nd-chip-input="${name}" placeholder="${values.length ? '' : esc(placeholder)}" `
        + `style="flex:1;min-width:60px;border:none;outline:none;background:transparent;font-size:12px;color:var(--text-normal);padding:2px 4px;">`;
    h += `</div>`;
    return h;
}

function esc(s) { return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
```

---

## 四、表单控件类型对照表

| 配置项 | 控件类型 | data-nd-field | 特殊处理 |
|--------|----------|---------------|----------|
| exclude | chip 输入 | `exclude` | 回车添加，点×删除 |
| planPath | text input | `planPath` | 路径字符串 |
| heatLevels[0..2] | number input × 3 | `heatLevels[0]` 等 | 自动排序 |
| heatWeeks | number input | `heatWeeks` | 10-104 |
| monthCount | number input | `monthCount` | 1-24 |
| dayCount | number input | `dayCount` | 1-30 |
| folderTopN | number input | `folderTopN` | 1-50 |
| maxOpen | number input | `maxOpen` | 0-20 |
| taskTags | chip 输入 | `taskTags` | 回车添加，点×删除 |
| dueEmoji | text input | `dueEmoji` | 单个 emoji |
| estThreshold | number input | `estThreshold` | >0 |
| estCoeff | number input | `estCoeff` | >0 |
| colorScheme | radio + 色块预览 | `colorScheme` | 点击切换方案 |

---

## 五、Tag/Chip 输入组件交互逻辑

```javascript
function bindChipInputs(panel) {
    panel.querySelectorAll('[data-nd-chip]').forEach(container => {
        const name = container.dataset.ndChip;
        const input = container.querySelector(`[data-nd-chip-input="${name}"]`);

        // 回车添加
        input.addEventListener('keydown', e => {
            if (e.key !== 'Enter' && e.key !== ',') return;
            e.preventDefault();
            const val = input.value.trim().replace(/,$/, '');
            if (!val) return;
            // 重建 chips 数组
            const chips = getChipValues(panel, name);
            if (chips.includes(val)) { input.value = ''; return; } // 去重
            chips.push(val);
            renderChips(container, name, chips);
            input.value = '';
        });

        // 点击×删除（事件委托）
        container.addEventListener('click', e => {
            const del = e.target.closest('[data-nd-chip-del]');
            if (!del) return;
            const idx = parseInt(del.dataset.ndChipDel);
            const chips = getChipValues(panel, name);
            chips.splice(idx, 1);
            renderChips(container, name, chips);
        });

        // 点击容器聚焦输入框
        container.addEventListener('click', e => {
            if (e.target.closest('[data-nd-chip-del]')) return;
            input.focus();
        });
    });
}

function getChipValues(panel, name) {
    const container = panel.querySelector(`[data-nd-chip="${name}"]`);
    return [...container.querySelectorAll('[data-nd-chip-val] span:first-child')].map(s => s.textContent);
}

function renderChips(container, name, values) {
    // 保留 input，重建 chips
    const input = container.querySelector(`[data-nd-chip-input="${name}"]`);
    container.querySelectorAll('[data-nd-chip-val]').forEach(el => el.remove());
    values.forEach((v, i) => {
        const chip = document.createElement('span');
        chip.dataset.ndChipVal = i;
        chip.style.cssText = 'display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:6px;background:var(--interactive-accent);color:#fff;font-size:11px;font-weight:500;animation:ndPopIn .2s ease-out;';
        chip.innerHTML = `<span>${esc(v)}</span><span data-nd-chip-del="${i}" style="cursor:pointer;font-size:13px;line-height:1;opacity:.7;">×</span>`;
        container.insertBefore(chip, input);
    });
}
```

---

## 六、配色方案预览（Radio + 色块）

已在第三节 `buildSettingsPanelHTML` 中实现。交互要点：

- 点击 label 时触发 hidden radio 的 change 事件
- 高亮当前选中项的边框 + 背景色
- 色块展示该方案的前 3 个主色
- 切换时实时更新底栏保存按钮的渐变色（视觉反馈）

```javascript
// 配色切换实时反馈
panel.querySelectorAll('[data-nd-scheme]').forEach(label => {
    label.addEventListener('click', () => {
        panel.querySelectorAll('[data-nd-scheme]').forEach(l => {
            const name = l.dataset.ndScheme;
            const sc = COLOR_SCHEMES[name];
            const active = name === label.dataset.ndScheme;
            l.style.borderColor = active ? sc.primary : 'var(--background-modifier-border)';
            l.style.background = active ? sc.primary + '12' : 'var(--background-secondary)';
            l.querySelector('span:last-child').style.fontWeight = active ? 700 : 400;
            l.querySelector('span:last-child').style.color = active ? sc.primary : 'var(--text-muted)';
        });
        // 更新保存按钮
        const sc = COLOR_SCHEMES[label.dataset.ndScheme];
        const saveBtn = panel.querySelector('[data-nd-action="save"]');
        if (saveBtn) { saveBtn.style.background = sc.gradient; saveBtn.style.boxShadow = `0 2px 8px ${sc.primary}40`; }
    });
});
```

---

## 七、Save / Reset 按钮行为

### 7.1 收集表单值

```javascript
function collectFormValues(panel) {
    const cfg = { ...DEFAULT_CONFIG };

    // 文本/数字字段
    panel.querySelectorAll('[data-nd-field]').forEach(input => {
        const name = input.dataset.ndField;
        if (input.type === 'number') {
            const val = parseFloat(input.value);
            if (!isNaN(val)) {
                // 处理 heatLevels[0] 这种数组索引
                if (name.includes('[')) {
                    const [arr, idx] = name.replace(']', '').split('[');
                    if (!Array.isArray(cfg[arr])) cfg[arr] = [...DEFAULT_CONFIG[arr]];
                    cfg[arr][parseInt(idx)] = val;
                } else {
                    cfg[name] = val;
                }
            }
        } else {
            cfg[name] = input.value.trim();
        }
    });

    // 排除文件夹（chip）
    cfg.exclude = getChipValues(panel, 'exclude');
    if (cfg.exclude.length === 0) cfg.exclude = [...DEFAULT_CONFIG.exclude]; // 防空

    // 任务标签（chip）
    cfg.taskTags = getChipValues(panel, 'taskTags');

    // 配色方案
    const checkedScheme = panel.querySelector('input[name="nd-color"]:checked');
    if (checkedScheme) cfg.colorScheme = checkedScheme.value;

    // heatLevels 排序
    cfg.heatLevels.sort((a, b) => a - b);

    return cfg;
}
```

### 7.2 保存

```javascript
panel.querySelector('[data-nd-action="save"]').addEventListener('click', async () => {
    const btn = panel.querySelector('[data-nd-action="save"]');
    const origText = btn.textContent;
    btn.textContent = '保存中...';
    btn.disabled = true;

    try {
        const newCfg = collectFormValues(panel);
        await saveToFrontmatter(newCfg);
        btn.textContent = '✓ 已保存';
        btn.style.background = '#22c55e';
        setTimeout(() => closePanel(), 600);
        // frontmatter 变更会自动触发 Dataview 重渲染，无需手动刷新
    } catch (err) {
        console.error('保存设置失败:', err);
        btn.textContent = '✗ 保存失败';
        btn.style.background = '#ef4444';
        setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 1500);
    }
});
```

### 7.3 恢复默认

```javascript
panel.querySelector('[data-nd-action="reset"]').addEventListener('click', () => {
    // 二次确认
    if (!confirm('确定恢复所有设置为默认值？')) return;

    // 清空 frontmatter 中的配置字段
    app.fileManager.processFrontMatter(dv.current().file, fm => {
        for (const key of Object.keys(DEFAULT_CONFIG)) {
            delete fm[key];
        }
    });

    closePanel();
    // Dataview 会自动重渲染，新渲染会读取 DEFAULT_CONFIG
});
```

### 7.4 面板开关

```javascript
function openPanel() {
    const cfg = loadConfig();
    const panel = document.getElementById(panelId);
    const overlay = document.getElementById(overlayId);
    panel.innerHTML = buildSettingsPanelHTML(cfg);
    panel.style.display = 'block';
    overlay.style.display = 'block';
    // 绑定交互
    bindChipInputs(panel);
    bindColorSchemeSwitcher(panel);
    // 关闭按钮
    panel.querySelector('[data-nd-action="close"]').addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    // ESC 关闭
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { closePanel(); document.removeEventListener('keydown', escHandler); }
    });
    // 入场动画
    panel.style.animation = 'ndPopIn .25s ease-out';
}

function closePanel() {
    const panel = document.getElementById(panelId);
    const overlay = document.getElementById(overlayId);
    if (panel) panel.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}
```

---

## 八、错误处理

| 场景 | 处理方式 |
|------|----------|
| frontmatter 字段类型不匹配 | `loadConfig()` 逐字段校验，不合法则用默认值 |
| heatLevels 长度 ≠ 3 | 回退默认值 `[400, 1200, 2500]` |
| heatLevels 未排序 | `loadConfig()` 自动 `.sort()` |
| colorScheme 不存在 | 回退 `'indigo'` |
| exclude 为空数组 | 保存时强制恢复默认（防排除全部文件夹） |
| 保存写入失败 | catch 错误，按钮显示红色"保存失败"，1.5s 后恢复 |
| processFrontMatter API 不可用（旧版 Obsidian） | try-catch 兜底，提示用户升级 Obsidian |
| 数值超出 min/max | `min`/`max` 属性限制 + `loadConfig()` 范围校验 |
| chip 输入重复值 | 去重检查，已存在则忽略 |

---

## 九、集成点（现有代码修改清单）

### 9.1 需要替换为配置值的硬编码位置

| 位置（行号） | 当前硬编码 | 替换为 |
|-------------|-----------|--------|
| L16 | `exclude: ['附件', '模板', 'copilot']` | `loadConfig()` 返回值的 `exclude` |
| L21 | `colors: ['#6366f1',...]` | `COLOR_SCHEMES[cfg.colorScheme].bar` |
| L414 | `dv.io.load('planning/成长计划.md')` | `dv.io.load(cfg.planPath)` |
| L448-451 | `words <= 400 ? 1 : words <= 1200 ? 2 : words <= 2500 ? 3 : 4` | `words <= cfg.heatLevels[0] ? 1 : words <= cfg.heatLevels[1] ? 2 : words <= cfg.heatLevels[2] ? 3 : 4` |
| L436 | `const W = 54` | `const W = cfg.heatWeeks` |
| L380 | `for (let i = 11; ...` | `for (let i = cfg.monthCount - 1; ...` |
| L403 | `for (let i = 6; ...` | `for (let i = cfg.dayCount - 1; ...` |
| L529-537 | 统计卡片颜色 | 使用 `scheme.primary` / `scheme.accent` |
| L574 | `#6366f1` / `#a78bfa` | `scheme.bar[0]` / `scheme.bar[1]` |
| L731 | `C.colors[i % C.colors.length]` | `scheme.bar[i % scheme.bar.length]` |
| L831 | `folderData.slice(0, 5)` | `folderData.slice(0, cfg.folderTopN)` |
| L1005 | `#urgent\|#important\|...` 硬编码 | 动态拼接 `cfg.taskTags` 的正则 |
| L1019 | `📅` 硬编码 | `cfg.dueEmoji` |
| L1088 | `const MAX_OPEN = 3` | `const MAX_OPEN = cfg.maxOpen` |
| L311 | `pages.length > 200` | `pages.length > cfg.estThreshold` |
| L316 | `Math.round((p.file.size \|\| 0) / 4)` | `Math.round((p.file.size \|\| 0) / cfg.estCoeff)` |

### 9.2 修改后的 C 对象初始化

```javascript
// 替换原来的 const C = { ... } 块
const cfg = loadConfig();
const scheme = COLOR_SCHEMES[cfg.colorScheme] || COLOR_SCHEMES.indigo;

const C = {
    exclude: cfg.exclude,
    selfPath: dv.current()?.file?.path || '',
    pad: n => String(n).padStart(2, '0'),
    fmt: n => (n || 0).toLocaleString(),
    days: ['', '一', '', '三', '', '五', ''],
    colors: scheme.bar,
    heatColors: {
        light: { e:'#ebedf0', c1:'#c8e6d0', c2:'#6cc085', c3:'#3a9d5e', c4:'#1f6e3a' },
        dark:  { e:'#2d333b', c1:'#1a5435', c2:'#2b7448', c3:'#409660', c4:'#57ab76' }
    },
    isDark: () => document.body.classList.contains('theme-dark'),
    pal: () => C.isDark() ? C.heatColors.dark : C.heatColors.light,
    clr: lv => { const p = C.pal(); return lv === 0 ? p.e : p['c' + lv]; },
    now: (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })(),
    get todayStr() { return `${this.now.getFullYear()}-${this.pad(this.now.getMonth()+1)}-${this.pad(this.now.getDate())}`; },
    get monthStr() { return this.todayStr.substring(0, 7); },
    get daysInMonth() { return new Date(this.now.getFullYear(), this.now.getMonth()+1, 0).getDate(); }
};
```

### 9.3 新增代码插入位置总览

```
行 14 之后   → DEFAULT_CONFIG + COLOR_SCHEMES 定义
行 15 之前   → loadConfig() / saveToFrontmatter() 函数
行 15 行     → const cfg = loadConfig(); const scheme = ...;
行 15-33    → C 对象改用 cfg / scheme
行 ~425     → 齿轮按钮 HTML
行 ~420     → 面板容器 + 遮罩层 HTML
行 ~1260    → 设置面板 HTML 生成函数 + 交互逻辑（写在 DOM 渲染前）
行 ~1274    → root.innerHTML = H.join('') 之后绑定齿轮按钮事件
```

---

## 十、实施步骤（建议顺序）

1. **新增 DEFAULT_CONFIG + COLOR_SCHEMES**（不改现有代码，零风险）
2. **新增 loadConfig() / saveToFrontmatter()**（独立函数，不影响渲染）
3. **新增设置面板 HTML/CSS/JS 函数**（独立区块，不影响现有逻辑）
4. **修改 C 对象**：读取 cfg 替换硬编码（6 处改动）
5. **修改热力图**：level() 函数用 cfg.heatLevels，W 用 cfg.heatWeeks
6. **修改统计面板**：monthRows/dayRows 生成循环用 cfg.monthCount/dayCount
7. **修改文件夹排行**：slice(0, cfg.folderTopN)
8. **修改待办看板**：MAX_OPEN → cfg.maxOpen，taskTags 动态化，dueEmoji 动态化
9. **修改词数缓存**：estThreshold / estCoeff 动态化
10. **插入齿轮按钮 + 面板容器 HTML**
11. **绑定事件**：openPanel / closePanel / save / reset
12. **测试**：修改各项配置 → 保存 → 验证重渲染 → 恢复默认 → 验证

---

## 十一、注意事项

- `processFrontMatter` 需要 Obsidian ≥ v0.15.0，低版本需降级为手动 YAML 编辑
- 面板使用 `position:fixed` + 高 z-index，确保在阅读模式下可见
- chip 输入的 `×` 删除按钮需阻止事件冒泡，避免误触容器聚焦
- 保存后 Dataview 自动重渲染，面板会被销毁（因为 DOM 重建），这是预期行为
- 如果用户在编辑模式下打开看板，齿轮按钮仍可点击（面板是 DOM 层面的，不依赖 Obsidian 编辑器状态）
