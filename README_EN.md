<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/English-1982d2?style=flat&logo=readme&logoColor=white"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/中文-d63031?style=flat&logo=readme&logoColor=white"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Obsidian-0.15+-%23483699?style=flat-square&logo=obsidian">
  <img src="https://img.shields.io/badge/Dataview-0.5+-%234a9c6d?style=flat-square&logo=dataview">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
  <a href="https://github.com/Inonvation/obsidian-note-dashboard/releases">
    <img src="https://img.shields.io/github/v/release/Inonvation/obsidian-note-dashboard?style=flat-square&color=orange">
  </a>
  <img src="https://img.shields.io/badge/single--file-684%20lines-brightgreen?style=flat-square">
</p>

<h1 align="center">Obsidian Note Dashboard</h1>
<p align="center">A single-file note-taking dashboard built with DataviewJS — Heatmap · Writing Stats · Folder Ranking · Task Board</p>

---

## Table of Contents

<a name="toc_en"></a>
[Preview](#preview_en) · [Animations](#animations_en) · [Features](#features_en) · [Dependencies](#dependencies_en) · [Getting Started](#usage_en) · [Customization](#customization_en) · [Similar Projects](#similar_en) · [Changelog](#changelog_en) · [Contributing](#contributing_en) · [License](#license_en)

---

## <a name="preview_en"></a>Preview

### Mobile

<table align="center">
  <tr>
    <td align="center" width="50%" style="padding:8px;">
      <img src="https://github.com/user-attachments/assets/48f67b85-aa4a-4857-9d1c-9e96945a0655" 
           width="90%"
           style="border:1px solid #e1e4e8; border-radius:10px;">
      <br><strong>🔥 Heatmap · 📁 Folder Ranking</strong>
      <br><span style="color:#586069;font-size:13px;">Yearly contribution · Word count ranking</span>
    </td>
    <td align="center" width="50%" style="padding:8px;">
      <img src="https://github.com/user-attachments/assets/179abf20-b509-42b0-b927-f0054648fdfb" 
           width="90%"
           style="border:1px solid #e1e4e8; border-radius:10px;">
      <br><strong>📊 Stats Overview · 📋 Task Board</strong>
      <br><span style="color:#586069;font-size:13px;">Total notes · Active days · Task aggregation</span>
    </td>
  </tr>
</table>

### Desktop

<p align="center">
  <img src="https://github.com/user-attachments/assets/6cae2aa5-905b-4bf3-8171-2f65adaffb1a" 
       width="90%"
       style="border:1px solid #e1e4e8; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <br><em>Full dashboard · Reading view</em>
</p>

---

## <a name="animations_en"></a>Animations

The animation system was completely rewritten in v1.2.0. All animations trigger sequentially when the dashboard opens, totaling ~1.5s.

<table align="center">
  <tr>
    <td align="center" width="50%" style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/5b123292-a1bc-4a20-af0c-0d8b02e1987d" 
           width="100%"
           style="border:1px solid #e1e4e8; border-radius:8px;">
      <br><strong>① Heatmap</strong>
      <br><span style="color:#586069;font-size:13px;">Column fade-in · old to new · 30ms interval</span>
    </td>
    <td align="center" width="50%" style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/6f818cd4-b9c5-47f3-95fd-49ddf4c7a327" 
           width="100%"
           style="border:1px solid #e1e4e8; border-radius:8px;">
      <br><strong>② Card Entrance</strong>
      <br><span style="color:#586069;font-size:13px;">Sliding from 4 directions · 80ms interval</span>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%" style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/0788e99f-acc3-46d8-8b25-1fba15a4ab23" 
           width="100%"
           style="border:1px solid #e1e4e8; border-radius:8px;">
      <br><strong>③ Progress Bars</strong>
      <br><span style="color:#586069;font-size:13px;">Fill from 0% · ease-out · 600ms</span>
    </td>
    <td align="center" width="50%" style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/d8d13cd9-9101-4e72-a58c-986c7e3ddb6c" 
           width="100%"
           style="border:1px solid #e1e4e8; border-radius:8px;">
      <br><strong>④ Counter Pop</strong>
      <br><span style="color:#586069;font-size:13px;">Count up from 0 · scale pulse · 800ms</span>
    </td>
  </tr>
</table>

> 💡 Also **⑤ Badge Pulse** — "This Month" and 🥇🥈🥉 badges breathe continuously (opacity 1→0.6→1, 2s cycle). This is a CSS animation and cannot be captured in a static screenshot.

---

## <a name="features_en"></a>Features

<table>
<tr>
<td width="33%">

**🔥 Yearly Contribution Heatmap**  
Color-coded by daily writing volume (5-level green gradient). Month labels frozen on the left, horizontally scrollable. Adapts to light/dark theme.

</td>
<td width="33%">

**📊 Statistics Overview**  
6 stat cards + monthly activity bar: total notes, total words, active days, today's writing, current streak, folder count.

</td>
<td width="34%">

**📆 Monthly Statistics**  
Notes count and word count per month with progress bars. Current month highlighted. Supports up to 12 months.

</td>
</tr>
<tr>
<td>

**📁 Folder Ranking**  
Sorted by word count descending. Each entry has a percentage bar with 🥇🥈🥉 badges.

</td>
<td>

**📋 Task Board**  
Aggregates all unchecked tasks grouped by source file. Groups ≤6 items are expanded by default, larger ones are collapsible.

</td>
<td>

**📱 Cross-platform**  
Responsive layout works on phone, tablet, and desktop. Heatmap supports touch scrolling on mobile.

</td>
</tr>
</table>

---

## <a name="dependencies_en"></a>Dependencies

| Software | Version | Notes |
|------|:--------:|------|
| [Obsidian](https://obsidian.md) | 0.15+ | Note-taking app |
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | 0.5+ | Required — enable JavaScript Queries in settings |

> ✅ No external APIs, no API keys, no paid services. Single file, 719 lines, ready to use.

---

## <a name="usage_en"></a>Getting Started

### 1. Install Dataview Plugin

```
Obsidian → Settings → Community plugins → Browse → Search "Dataview" → Install → Enable
```

Go to Dataview settings and toggle **Enable JavaScript Queries**.

### 2. Download the Dashboard

Download `📊-我的笔记看板.md` from the [latest Release](https://github.com/Inonvation/obsidian-note-dashboard/releases) and place it anywhere in your vault (root or subfolder — the code auto-detects the path).

### 3. Open the Dashboard

Open the file in Obsidian and wait a few seconds for Dataview to index your vault. The dashboard automatically switches to reading mode with full data displayed.

> 💡 **Blank on first open?** Run **Dataview: Force refresh all views** from the command palette (`Ctrl/Cmd + P`).

### 4. (Optional) Set as Homepage

Set it as your default startup file in Obsidian settings, or use a plugin like [Homepage](https://github.com/mirnovs/obsidian-homepage).

---

## <a name="customization_en"></a>Customization

All adjustable parameters are in the `C` object at the top of `📊-我的笔记看板.md`:

```javascript
const C = {
    exclude: ['附件', '模板', 'copilot'],   // folders to exclude
    days: ['', '一', '', '三', '', '五', ''], // weekday labels (empty = hidden)
    colors: ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd',
             '#a5b4fc','#818cf8','#6d28d9','#4f46e5'],  // monthly bar colors
    heatColors: {
        light: { e:'#ebedf0', c1:'#c8e6d0', c2:'#6cc085', c3:'#3a9d5e', c4:'#1f6e3a' },
        dark:  { e:'#2d333b', c1:'#1a5435', c2:'#2b7448', c3:'#409660', c4:'#57ab76' }
    }
};
```

| Parameter | Description |
|-----------|-------------|
| `C.exclude` | Folders to exclude from statistics |
| `C.heatColors` | 5-level color palette for light/dark theme |
| `C.colors` | 8-color array for monthly progress bars |
| `C.days` | Weekday labels (left side of heatmap) |

> 💡 Create a task list with `- [x]` / `- [ ]` in `planning/成长计划.md`, and the dashboard will detect it and display a completion bar.

---

## <a name="similar_en"></a>Similar Projects

| Project | ⭐ | Difference |
|---------|:-:|------------|
| [vran-dev/obsidian-contribution-graph](https://github.com/vran-dev/obsidian-contribution-graph) | 432 | Full plugin with interactive heatmap, no dashboard |
| [InlitX/Obsidian-Dashboard-Gallery](https://github.com/InlitX/Obsidian-Dashboard-Gallery) | — | Focused on visual design, no word count / folder stats |
| [yirsi/obsidian-habit-heatmap](https://github.com/yirsi/obsidian-habit-heatmap) | — | Gamified habit tracking, different scope |

---

## <a name="changelog_en"></a>Changelog

**v1.4.2 (2026-05-19)**
- Fixed heatmap data calculation errors
- Fixed auto-switch to reading mode on first open in dark mode (desktop)
- Optimized code structure

**v1.4.1 (2026-05-18)**
- Fixed potential freeze in some scenarios
- Fixed animation jitter caused by re-rendering
- Fixed re-render issue on first launch (mobile)
- Optimized rendering logic for smoother animation
- Better performance with many notes, reduced lag

<details>
<summary>📜 Historical Changelog</summary>

**v1.4.0 (2026-05-18)**
- **Smooth rendering**: Eliminated flash and preview-switch jitter, `__ndRenderedKey` prevents duplicate animations
- **Layout change**: Dual-column → full-width, monthly chart and folder ranking each on their own row
- **Animation refactor**: Delays moved from CSS to JS, first-render vs re-execution paths
- Fixed flash and progress bar jitter on multi-pane/tab switching

**v1.3.0 (2026-05-17)**
- Heatmap not updating weekly: switched to sliding window (54 columns), auto-shifts every Sunday
- Date anchor bug: now uses the later of "last day with data" and "today"
- Future dates skipped data queries: pre-written diary entries now show colors
- Future dates filled with lightest color instead of blank
- Month labels use absolute positioning; hidden when clipped at window edge
- Color thresholds relaxed (200/800/2500 chars) for better gradient distribution
- Removed redundant variables, extracted animation delay function, block-scoped modules, grouped constants

**v1.2.0 (2026-05-16)**
- Auto-switch to reading mode, multi-pane compatible
- Animations overhauled: card entrance, progress bars, heatmap fade-in, counter pop, badge pulse
- Content caching — instant open on second load
- Code reduced from 521 to 481 lines
- Fixed multi-pane / heatmap scroll / progress bar jitter bugs

**v1.1.0 (2026-05-16)**
- Unified global config in `C` object
- Word count optimized (Chinese by character, English by space)
- Card entrance animation + hover float effect
- Global `nd-` prefixed CSS classes for cleaner rendering
- Auto-fix preview mode, isolated global variable conflicts

</details>

---

## <a name="contributing_en"></a>Contributing

Contributions are welcome!

- 🐛 Submit an [Issue](https://github.com/Inonvation/obsidian-note-dashboard/issues) for bugs or feature requests
- 🔀 Submit a Pull Request to improve the code
- ⭐ Star the repo to help others discover the project

---

## <a name="license_en"></a>License

This project is open source under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

<p align="center">Built with ❤️ for the Obsidian community</p>
