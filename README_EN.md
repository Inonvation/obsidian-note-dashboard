---

**`README_EN.md`**

# Obsidian Note Dashboard

<p align="center">
  <a href="README.md">🇨🇳 中文</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Obsidian-7C3AED?style=flat&logo=obsidian&logoColor=white">
  <img src="https://img.shields.io/badge/DataviewJS-FF6B6B?style=flat">
  <img src="https://img.shields.io/badge/license-MIT-blue">
</p>

A self-contained note-taking dashboard built with DataviewJS — GitHub-style heatmap, writing statistics, folder ranking, and task aggregation, all in a single `.md` file.

## Preview

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

## Features

**🔥 Yearly Contribution Heatmap**
Color-coded by daily writing volume (5-level green gradient). Month labels frozen on the left, horizontally scrollable. Adapts to light/dark theme automatically.

**📊 Statistics Overview**
6 stat cards + monthly activity bar: total notes, total word count, active days, today's writing, current streak, folder count.

**📆 Monthly Statistics**
Notes count and word count per month with progress bars. Current month highlighted. Supports up to 12 months.

**📁 Folder Ranking**
Sorted by total word count descending. Each entry shows a percentage bar with 🥇🥈🥉 badges.

**📋 Task Board**
Aggregates all unchecked tasks grouped by source file. Groups with ≤6 items are expanded by default.

**📱 Cross-platform**
Responsive layout works on phone, tablet, and desktop. Heatmap supports touch scrolling on mobile.

## Dependencies

| Software | Version | Notes |
|---|---|---|
| [Obsidian](https://obsidian.md) | 0.15+ | Note-taking app |
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | 0.5+ | Required — **JavaScript Queries** must be enabled in settings |

No external APIs, API keys, or paid services required.

## Getting Started

### Install Dataview

1. Open Obsidian → Settings → Community plugins → Browse
2. Search for **Dataview** and install it
3. Go to Dataview settings and enable **"Enable JavaScript Queries"**

### Add the Dashboard File

4. Download `📊-我的笔记看板.md` to any location in your vault
5. Open the file in Obsidian — Dataview will index your vault automatically
6. If it shows blank on first open, run `Dataview: Force refresh all views` from the command palette

### Optional: Set as Homepage

7. Set it as your default startup page in Obsidian settings
8. Or embed it using a homepage plugin

## Customization

All adjustable parameters are at the top of each `dataviewjs` block:

| Parameter | Location | Description |
|---|---|---|
| `EXCLUDE` | Top of all 3 blocks | Folders to exclude — defaults: `附件`, `模板`, `copilot` |
| `L` / `D` (4 colors) | Heatmap block | Light/dark theme 5-level palette |
| `COLORS` | Stats block | 8-color array for monthly bars |
| `C` / `G` / `R` | Heatmap block | Cell size / gap / border-radius (px) |
| `DAYS` | Heatmap block | Weekday labels, defaults to Mon/Wed/Fri only |

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

If you maintain a task list with `- [x]` / `- [ ]` format in `planning/成长计划.md`, the dashboard will automatically calculate and display the completion progress bar.

---

<p align="center">
  <sub>Built with ❤️ for the Obsidian community · MIT License</sub>
</p>
```
