# Project Rules — Obsidian Note Dashboard

> 基于 DataviewJS 的单文件笔记统计看板：热力图 · 写作统计 · 文件夹排行 · 待办聚合

## 项目结构

```
github/obsidian-note-dashboard/     ← 单源（子项目根）
├── 📊-我的笔记看板.md              # 看板主文件（单源）
├── PROJECT_RULES.md                 # 本文件
├── opencode.json                   # opencode 配置
├── .opencode/                      # 工作流配置
│   ├── agent/                      # Agent 角色定义
│   ├── command/                    # 快捷命令
│   └── skills/                     # Skill 流程定义
│       ├── obsidian-release/
│       ├── code-review/
│       ├── docs-sync/
│       └── obsidian-dev/
├── release/                        # Release notes
├── README.md / README_EN.md
└── LICENSE
```

Obsidian vault 中通过 wiki link `[[github/obsidian-note-dashboard/📊-我的笔记看板|看板]]` 引用。

## 工作流

- 看板文件以本仓库为唯一源（不再在 vault 根保存副本）
- Obsidian 内通过 wiki link 直接引用，无需手动同步
- 不添加多余注释到代码中
- **发版相关请求会自动触发 `obsidian-release` skill**，指令会注入上下文

## 自定义命令

重复性任务优先加载 `.opencode/` 中的 agent 规则执行：
- `/release` — 完整发版流程
- `/sync-docs` — 同步 README.md ↔ README_EN.md
- `/review` — 审查看板代码质量

## Git 约定

- 类型前缀：`feat:` / `fix:` / `chore:` / `docs:` / `release:`
- 版本 tag：`v{major}.{minor}.{patch}`

## Release 附件命名

`obsidian-note-dashboard-v{version}.md`（英文名，避免中文/emoji）