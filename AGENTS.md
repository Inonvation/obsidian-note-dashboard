# Project Rules — 📊 Obsidian Note Dashboard

> 基于 DataviewJS 的单文件笔记统计看板：热力图 · 写作统计 · 文件夹排行 · 待办聚合

## 项目结构

```
vault 根目录/
├── 📊-我的笔记看板.md          # 主文件（实际使用）
├── _rules/看板修改规则.md       # 修改规则
└── github/obsidian-note-dashboard/  # GitHub 仓库镜像
    ├── 📊-我的笔记看板.md       # 仓库看板（与根目录同步）
    ├── AGENTS.md               # 本文件
    ├── opencode.json           # opencode 配置
    ├── .opencode/              # agent 子任务配置
    │   ├── agent/
    │   │   ├── release-manager.md
    │   │   ├── docs-sync.md
    │   │   ├── code-review.md
    │   │   └── obsidian-dev.md
    │   └── command/
    │       ├── release.md
    │       ├── sync-docs.md
    │       └── review.md
    ├── release/                # Release notes
    ├── README.md / README_EN.md
    └── LICENSE
```

## 工作流

- 所有修改以本地仓库 (`github/obsidian-note-dashboard/`) 为准，远程只是镜像
- vault 根目录的 `📊-我的笔记看板.md` 是最新版，修改后立即同步到仓库
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
