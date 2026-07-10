# Architecture

## Overview

Obsidian Note Dashboard provides two distribution methods:

- **Dataview version** (dataview/我的笔记看板.md): A single-file JS app embedded in a DataviewJS code block. The primary development target.
- **Plugin version** (plugin/): Modular TypeScript compiled to main.js via esbuild. Synced from the Dataview version via scripts/sync-from-dataview.mjs.

## Plugin Version Structure

`
plugin/
├── main.ts              ← Entry point: registers view, commands, settings
├── src/
│   ├── data.ts          ← Public API for data collection (re-exports from collect/)
│   ├── collect/         ← Data collection modules
│   │   ├── index.ts     ← main collectData() orchestrator
│   │   ├── cache.ts     ← Word count cache
│   │   ├── tasks.ts     ← Task parsing from markdown
│   │   └── streak.ts    ← Streak & month-active computation
│   ├── components/      ← Render functions (pure: data → HTML string)
│   │   ├── heatmap.ts   ← Contribution heatmap
│   │   ├── stats-cards.ts ← Statistics cards grid
│   │   ├── chart.ts     ← Monthly / 7-day bar chart
│   │   ├── ranking.ts   ← Folder / file ranking tabs
│   │   ├── plan-progress.ts ← Growth plan progress bar
│   │   ├── recent-edits.ts ← Recently modified files
│   │   ├── tasks-board.ts ← Todo task board
│   │   ├── chart-handler.ts ← Chart toggle interaction
│   │   ├── navigation-handler.ts ← File link navigation
│   │   ├── ranking-handler.ts ← Rank tab switching
│   │   └── tasks-board-handler.ts ← Task checkbox & folder accordion
│   ├── stats/
│   │   └── word-count.ts ← Word count engine
│   ├── lib/
│   │   └── html.ts      ← Tagged template helper
│   ├── types.ts         ← TypeScript types
│   ├── settings.ts      ← Default settings
│   ├── color-schemes.ts ← 7 color schemes
│   ├── setting-tab.ts   ← Settings UI
│   └── utils.ts         ← Utility functions
└── styles.css           ← All dashboard styles (~580 lines)
`

## Rendering Flow

1. main.ts:DashboardView.renderDashboard() orchestrates the render
2. Reads settings, collects data via collectData()
3. Iterates sectionOrder[], calling each component's render function
4. Sets container.innerHTML with the concatenated HTML string
5. Registers event handlers (delegation on container)

Each render function is a pure (data, config) => string function — testable without Obsidian API.
