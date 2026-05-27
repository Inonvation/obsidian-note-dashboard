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
  <img src="https://img.shields.io/badge/single--file-1622%20lines-brightgreen?style=flat-square">
</p>

<h1 align="center">Obsidian Note Dashboard</h1>
<p align="center">A single-file note-taking dashboard built with DataviewJS — Heatmap · Writing Stats · Folder Ranking · Task Board</p>

---

[Preview](#preview) · [Features](#features) · [Settings](#settings) · [Animations](#animations) · [Dependencies](#dependencies) · [Getting Started](#usage) · [Changelog](#changelog)

---

## <a name="preview"></a>Preview

<table align="center">
  <tr>
    <td align="center" width="50%" style="padding:8px;">
      <img src="https://github.com/user-attachments/assets/48f67b85-aa4a-4857-9d1c-9e96945a0655" 
           width="90%"
           style="border:1px solid #e1e4e8; border-radius:10px;">
      <br><strong style="color:#6366f1;">Heatmap · Folder Ranking</strong>
      <br><span style="color:#586069;font-size:13px;">Yearly contribution · Word count ranking</span>
    </td>
    <td align="center" width="50%" style="padding:8px;">
      <img src="https://github.com/user-attachments/assets/179abf20-b509-42b0-b927-f0054648fdfb" 
           width="90%"
           style="border:1px solid #e1e4e8; border-radius:10px;">
      <br><strong style="color:#10b981;">Stats Overview · Task Board</strong>
      <br><span style="color:#586069;font-size:13px;">Total notes · Active days · Task aggregation</span>
    </td>
  </tr>
</table>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6cae2aa5-905b-4bf3-8171-2f65adaffb1a" 
       width="90%"
       style="border:1px solid #e1e4e8; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <br><em style="color:#586069;">Desktop · Full Dashboard</em>
</p>

---

## <a name="features"></a>Features

<table>
<tr>
<td width="33%">

**<span style="color:#6366f1;">Heatmap</span>**

54-column sliding window, 5-level gradient coloring, horizontal scroll, lazy loading

</td>
<td width="33%">

**<span style="color:#10b981;">Stats Overview</span>**

6 stat cards + monthly activity bar, counter pop animation

</td>
<td width="34%">

**<span style="color:#f59e0b;">Bar Chart</span>**

Monthly/7-day toggle, auto-scaled Y-axis, rise transition

</td>
</tr>
<tr>
<td>

**<span style="color:#f43f5e;">Folder Ranking</span>**

List/pie dual view, anti-collision algorithm, sector expand animation

</td>
<td>

**<span style="color:#0ea5e9;">Growth Progress</span>**

Auto-detect growth plan, gradient progress bar, shimmer effect

</td>
<td>

**<span style="color:#f97316;">Task Board</span>**

File-grouped, priority/due date markers, click to complete

</td>
</tr>
<tr>
<td>

**<span style="color:#64748b;">Settings Panel</span>**

7 color schemes one-click switch, all configs visual adjustment

</td>
<td>

**<span style="color:#8b5cf6;">Smooth Rendering</span>**

Force reading mode, eliminate flicker, instant re-render

</td>
<td>

**<span style="color:#14b8a6;">Cross-platform</span>**

Responsive layout, works on phone/tablet/desktop

</td>
</tr>
</table>

---

## <a name="settings"></a>Settings

Click the gear icon at the top-right corner of the dashboard. All configs preview in real-time and take effect immediately after saving.

| Color Scheme | Indigo | Emerald | Amber | Rose | Sky | Coral | Slate |
|:--------|:------:|:-------:|:-----:|:----:|:---:|:-----:|:-----:|
| Primary | <span style="color:#6366f1;">`#6366f1`</span> | <span style="color:#10b981;">`#10b981`</span> | <span style="color:#f59e0b;">`#f59e0b`</span> | <span style="color:#f43f5e;">`#f43f5e`</span> | <span style="color:#0ea5e9;">`#0ea5e9`</span> | <span style="color:#f97316;">`#f97316`</span> | <span style="color:#64748b;">`#64748b`</span> |

**Configurable items:** Exclude folders · Ranking count · Task expand groups · Growth plan path · Priority tags · Due date emoji · Estimation threshold · Estimation coefficient

All configs can be customized via Frontmatter YAML. Color schemes are persisted via localStorage.

---

## <a name="animations"></a>Animations

| Animation | Duration | Description |
|:-----|:----:|:-----|
| Heatmap column fade-in | 30ms/column | Appear from old to new |
| Card four-direction slide | 0.5s | Elastic easing entrance from up/down/left/right |
| Counter pop | 0.8s | Count from 0, scale pulse effect |
| Progress bar fill | 0.6s | Fill from 0, ease-out |
| Bar chart rise | 1.2s | Rise from 0 to target height |
| Pie chart sector expand | 0.85s | Sector scan expand |

---

## <a name="dependencies"></a>Dependencies

| Software | Version |
|:-----|:----:|
| [Obsidian](https://obsidian.md) | 0.15+ |
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | 0.5+ |

> No external APIs, no paid services. All data stays local.

---

## <a name="usage"></a>Getting Started

1. **Install Dataview** -- Settings -> Community plugins -> Search "Dataview" -> Install -> Enable
2. **Enable JavaScript** -- Toggle `Enable JavaScript Queries` in Dataview settings
3. **Download Dashboard** -- Get `.md` file from [Release](https://github.com/Inonvation/obsidian-note-dashboard/releases), place anywhere in your vault
4. **Open Dashboard** -- Open the file in Obsidian, wait for Dataview indexing to complete

> Blank on first open? Run `Dataview: Force refresh all views` from the command palette.

---

## <a name="changelog"></a>Changelog

### <span style="color:#6366f1;">v2.2.0 (2026-05-27)</span>

**New Features**
- Added visual settings panel: click gear icon at top-right corner
- 7 color schemes: Indigo, Emerald, Amber, Rose, Sky, Coral, Slate
- Frontmatter config support: all settings customizable via YAML
- Help tooltips: question mark icons on non-obvious options

**Performance & Optimization**
- Load resilience: single note failure no longer crashes the entire dashboard
- Task sorting optimization: improved speed for large task lists
- Completion reliability: auto-recovery on task marking failure
- Plan parsing enhancement: supports more Markdown list formats

**Code Refactoring**
- Extracted common animation function: unified fold/unfold logic, ~80 lines reduced
- Config system refactoring: all hardcoded personalizations unified as configurable items

### <span style="color:#10b981;">v2.1.1 (2026-05-26)</span>
- Expand/collapse uses precise height transitions, eliminating visual lag and page jumps
- Pie chart centered with anti-collision labels and straight leader lines
- Expand/Collapse All uses staggered animation to prevent layout thrashing
- Fixed task board progress bar not showing on lazy load
- Fixed Expand/Collapse All button initial state and click handling

### <span style="color:#f59e0b;">v2.1.0 (2026-05-24)</span>
- Performance optimization: lazy loading for heatmap/task board, faster first-screen rendering
- On-demand generation: pie/bar chart built only when switching views
- Error boundary: friendly error message instead of blank screen

### <span style="color:#f43f5e;">v2.0.0 (2026-05-22)</span>
- Task board refactored: file-grouped layout with collapsible sections
- Priority markers: `!!` urgent (blinking), `!` important
- Due date parsing: supports `📅 YYYY-MM-DD`, auto-labels overdue/today/upcoming
- 7-day word count: toggle between monthly and 7-day view
- Folder pie chart: list/pie dual view mode

<details>
<summary>Historical Versions</summary>

| Version | Date | Highlights |
|:----|:----:|:-----|
| v1.4.2 | 2026-05-19 | Fixed heatmap calculation errors, dark mode preview switch bug |
| v1.4.1 | 2026-05-18 | Fixed potential freeze, re-render jitter, mobile first-launch issue |
| v1.4.0 | 2026-05-18 | Smooth rendering engine, eliminated flicker; full-width layout |
| v1.3.0 | 2026-05-17 | Heatmap 54-column sliding window, color threshold adjustment |
| v1.2.0 | 2026-05-16 | Auto-switch to reading mode, 4 entrance animations |
| v1.1.0 | 2026-05-16 | Unified global config `C` object, Chinese/English word count |

</details>

---

## License

This project is open source under the **MIT License**.