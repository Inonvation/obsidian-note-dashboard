# Note Dashboard

笔记统计看板：热力图、写作统计、文件夹排行、待办聚合。

提供两种版本：
- **Plugin 版本**：Obsidian 原生插件，无需依赖 Dataview
- **Dataview 版本**：基于 DataviewJS 的单文件看板

## Features

- 热力图：GitHub 风格的写作热力图，54 周滑动窗口
- 统计总览：笔记总数、总词数、活跃天数、今日已写、连续天数
- 月度/7天图表：可切换的柱状图，显示写作趋势
- 文件夹排行：按词数排序的文件夹排行榜
- 成长进度：解析计划文件的 checkbox 进度条
- 最近编辑：最近编辑的文件列表
- 待办看板：按文件分组、优先级标记、逾期提醒
- 6 种配色方案：indigo、emerald、amber、rose、sky、coral

## Installation

### Plugin 版本（推荐）

#### From GitHub Release

1. 从 [Releases](https://github.com/Inonvation/obsidian-note-dashboard/releases) 下载最新版本
2. 下载 `main.js`、`manifest.json`、`styles.css`
3. 复制到你的 Obsidian vault 的 `.obsidian/plugins/note-dashboard/` 目录
4. 重启 Obsidian
5. 在 设置 → 第三方插件 中启用 "Note Dashboard"

#### Manual Build

```bash
git clone https://github.com/Inonvation/obsidian-note-dashboard.git
cd obsidian-note-dashboard/plugin
npm install
npm run build
```

将生成的 `main.js`、`manifest.json`、`styles.css` 复制到插件目录。

### Dataview 版本

1. 确保已安装 [Dataview](https://github.com/blacksmithgu/obsidian-dataview) 插件
2. 从 `dataview/` 目录复制 `note-dashboard.md` 到你的 vault
3. 在 Obsidian 中打开该文件，选择 "Dataview JS" 语言

## Configuration

### Plugin 版本

| Option | Default | Description |
|--------|---------|-------------|
| 配色方案 | indigo | 看板配色主题 |
| 排除文件夹 | 附件, 模板, copilot | 不计入统计的文件夹 |
| 成长计划路径 | planning/成长计划.md | 计划文件的相对路径 |
| 热力图周数 | 54 | 显示最近多少周 |
| 热力图阈值 | 400, 1200, 2500 | 热力图等级阈值 |
| 文件夹排行数量 | 5 | 显示前 N 个文件夹 |
| 月度图表月数 | 12 | 显示最近几个月 |
| 7天图表天数 | 7 | 显示最近几天 |
| 待办看板默认展开数 | 3 | 默认展开前 N 个文件 |
| 待办标签 | #urgent, #important, ... | 优先级标签 |

## Project Structure

```
obsidian-note-dashboard/
├── plugin/                    # Plugin 版本源码
│   ├── src/
│   ├── main.ts
│   ├── manifest.json
│   ├── styles.css
│   └── package.json
├── dataview/                  # DataviewJS 版本
│   └── note-dashboard.md
└── .github/workflows/
    └── release.yml            # 自动发布脚本
```

## Development

```bash
# 进入 plugin 目录
cd plugin

# 开发模式（监听文件变化）
npm run dev

# 构建生产版本
npm run build
```

## License

MIT
