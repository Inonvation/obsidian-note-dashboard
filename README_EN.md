# Obsidian Note Dashboard

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/English-1982d2?style=flat&logo=readme&logoColor=white"></a>
  <a href="README_CN.md"><img src="https://img.shields.io/badge/中文-d63031?style=flat&logo=readme&logoColor=white"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Obsidian-7C3AED?style=flat&logo=obsidian&logoColor=white">
  <img src="https://img.shields.io/badge/DataviewJS-FF6B6B?style=flat&logo=javascript&logoColor=white">
  <img src="https://img.shields.io/github/v/release/Inonvation/obsidian-note-dashboard?style=flat&label=release">
  <img src="https://img.shields.io/github/stars/Inonvation/obsidian-note-dashboard?style=flat&logo=github&label=stars">
  <img src="https://img.shields.io/github/last-commit/Inonvation/obsidian-note-dashboard?style=flat&logo=git&label=updated">
  <img src="https://img.shields.io/github/issues/Inonvation/obsidian-note-dashboard?style=flat&logo=github&label=issues">
  <img src="https://img.shields.io/badge/license-MIT-blue">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat&logo=github">
</p>

<p align="center">
  <b>📊 A single-file note-taking dashboard built with DataviewJS</b><br>
  <sub>GitHub-style heatmap · Writing statistics · Folder ranking · Task aggregation · All in one `.md` file</sub>
</p>

---

## 📖 Table of Contents

- [Preview](#-preview)
- [Features](#-features)
- [Dependencies](#-dependencies)
- [Getting Started](#-getting-started)
- [Customization](#-customization)
- [Similar Projects](#-similar-projects)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🖼️ Preview

<p align="center">
  <strong>📱 Mobile view</strong>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/48f67b85-aa4a-4857-9d1c-9e96945a0655" width="300">
  &emsp;
  <img src="https://github.com/user-attachments/assets/179abf20-b509-42b0-b927-f0054648fdfb" width="300">
</p>

<p align="center">
  <strong>💻 Desktop view</strong>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6cae2aa5-905b-4bf3-8171-2f65adaffb1a" width="800">
</p>

---

## ✨ Features

**🔥 Yearly Contribution Heatmap**
Color-coded by daily writing volume (5-level green gradient). Month labels frozen on the left, horizontally scrollable. Automatically adapts to light/dark theme.

**📊 Statistics Overview**
6 stat cards + monthly activity bar: total notes, total word count, active days, today's writing, current streak, folder count.

**📆 Monthly Statistics**
Notes count and word count per month with progress bars. Current month highlighted. Supports up to 12 months of data.

**📁 Folder Ranking**
Sorted by total word count descending. Each entry shows a percentage bar with 🥇🥈🥉 badges — instantly spot which folder is most active.

**📋 Task Board**
Aggregates all unchecked tasks grouped by source file. Groups with ≤6 items are expanded by default, larger groups are collapsible.

**📱 Cross-platform**
Responsive grid layout works seamlessly on phone, tablet, and desktop. Heatmap supports touch scrolling on mobile devices.

---

## 📦 Dependencies

| Software | Version | Notes |
|---|---|---|
| [Obsidian](https://obsidian.md) | 0.15+ | Note-taking app |
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | 0.5+ | Required — **JavaScript Queries** must be enabled in settings |

> ✅ No external APIs, no API keys, no paid services required.

---

## 🚀 Getting Started

### 1. Install Dataview Plugin

```
Obsidian → Settings → Community plugins → Browse → Search "Dataview" → Install → Enable
```

Then go to Dataview settings and toggle **"Enable JavaScript Queries"**.

### 2. Add the Dashboard File

Download `📊-我的笔记看板.md` to any location in your vault (root or subfolder — it auto-detects the path). Open it in Obsidian and wait a few seconds for Dataview to index your vault.

> 💡 **First time opening and it's blank?** Run `Dataview: Force refresh all views` from the command palette (Ctrl/Cmd + P).

### 3. (Optional) Set as Homepage

Set it as your default startup page in Obsidian settings, or embed it using a homepage plugin like [Homepage](https://github.com/mirnovs/obsidian-homepage).

---

## 🎨 Customization

All adjustable parameters are at the top of each `dataviewjs` code block:

| Parameter | Location | Description |
|---|---|---|
| `EXCLUDE` | Top of all 3 blocks | Folders to exclude from stats — defaults: `附件`, `模板`, `copilot` |
| `L` / `D` (4 colors each) | Heatmap block | 5-level color palette for light / dark theme |
| `COLORS` | Stats block | 8-color array for monthly progress bars |
| `C` / `G` / `R` | Heatmap block | Cell size / gap / border-radius (in pixels) |
| `DAYS` | Heatmap block | Weekday labels — defaults to Mon/Wed/Fri only |

### Exclude Folders

```javascript
const EXCLUDE = ['附件', '模板', 'copilot'];
```

### Change Heatmap Colors

```javascript
const L = { e:'#ebedf0', c1:'#c8e6d0', c2:'#6cc085', c3:'#3a9d5e', c4:'#1f6e3a' };
const D = { e:'#2d333b', c1:'#1a5435', c2:'#2b7448', c3:'#409660', c4:'#57ab76' };
```

### Enable Growth Plan

Maintain a task list with `- [x]` / `- [ ]` format in `planning/成长计划.md`, and the dashboard will automatically calculate & display the completion progress bar.

---

## 🔗 Similar Projects

| Project | Difference |
|---|---|
| [vran-dev/obsidian-contribution-graph](https://github.com/vran-dev/obsidian-contribution-graph) ⭐432 | Full plugin with interactive heatmap, but no statistics dashboard |
| [InlitX/Obsidian-Dashboard-Gallery](https://github.com/InlitX/Obsidian-Dashboard-Gallery) | Beautiful visual dashboards, no word count / folder stats |
| [yirsi/obsidian-habit-heatmap](https://github.com/yirsi/obsidian-habit-heatmap) | Gamified habit tracker — different scope from note-writing stats |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 [Open an issue](https://github.com/Inonvation/obsidian-note-dashboard/issues) for bugs or feature requests
- 🔀 Submit a pull request to improve the code
- ⭐ Star the repo if you find it useful

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Inonvation/obsidian-note-dashboard&type=Date)](https://star-history.com/#Inonvation/obsidian-note-dashboard&Date)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

<p align="center">
  <sub>Built with ❤️ for the Obsidian community</sub>
  <br>
  <sub>If this dashboard helps you, consider <a href="https://ko-fi.com/你的链接">buying me a coffee ☕</a></sub>
</p>
```
