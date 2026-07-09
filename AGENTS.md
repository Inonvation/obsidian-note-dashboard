# Obsidian Note Dashboard — 项目说明

## 目录结构

```
obsidian-note-dashboard/
├── dataview/                   ← DataviewJS 版本（单文件，需安装 Dataview 插件）
│   └── 我的笔记看板.md      ← v3 完整看板
├── plugin/                     ← Obsidian 插件版（TypeScript 源码 + 构建产物）
│   ├── src/                    ←   TypeScript 源码
│   │   ├── types.ts            ←     类型定义
│   │   ├── settings.ts         ←     设置项 schema
│   │   ├── data.ts             ←     数据收集
│   │   ├── utils.ts            ←     工具函数
│   │   ├── setting-tab.ts      ←     设置面板 UI
│   │   ├── color-schemes.ts    ←     配色方案
│   │   ├── stats/word-count.ts ←     字数统计
│   │   └── components/         ←     各看板区块
│   │       ├── heatmap.ts      ←     贡献热力图
│   │       ├── stats-cards.ts  ←     统计卡片
│   │       ├── chart.ts        ←     文件夹饼图
│   │       ├── ranking.ts      ←     文件夹排行
│   │       ├── plan-progress.ts←     成长进度
│   │       ├── recent-edits.ts ←     最近编辑
│   │       └── tasks-board.ts  ←     待办看板
│   ├── main.ts                 ←   插件入口
│   ├── main.js                 ←   构建产物（Obsidian 加载）
│   ├── manifest.json           ←   插件元信息
│   ├── styles.css              ←   插件样式
│   ├── package.json            ←   npm 依赖
│   └── esbuild.config.mjs      ←   esbuild 打包配置
├── .github/workflows/
│   └── release.yml             ← 自动发版（插件版 + Dataview 版分别打包）
├── README.md
└── .gitignore
```

## 构建命令

```bash
cd plugin
npm install      # 安装依赖
npm run dev      # 开发模式（监听文件变更）
npm run build    # 构建生产版本（生成 main.js）
```

## 两种使用方式

| 方式 | 依赖 | 入口文件 |
|------|------|----------|
| **Dataview 版** | Obsidian + Dataview 插件 | `dataview/我的笔记看板.md` |
| **插件版** | 无额外依赖 | `plugin/main.js` + `manifest.json` + `styles.css` |

插件版安装：将 `plugin/` 下的 `main.js`、`manifest.json`、`styles.css` 复制到 `.obsidian/plugins/note-dashboard/` 目录，重启 Obsidian 并启用插件。

## 发版约定

- 打 tag 推送后自动触发 GitHub Actions 发版
- 分两阶段串行执行：
  1. **插件版**：构建后上传 `main.js`、`manifest.json`、`styles.css`
  2. **Dataview 版**：上传 `我的笔记看板.md`
- 两个版本上传到同一个 Release
- 提交信息用中文

## 工作流

1. 修改源码 → `cd plugin && npm run dev` 调试
2. 更新 Dataview 版：同步修改 `dataview/我的笔记看板.md`
3. 提交（用中文） → 打 tag → 推送 → 自动发版
