# Project Rules — 📊 Obsidian Note Dashboard

> 基于 DataviewJS 的单文件笔记统计看板：热力图 · 写作统计 · 文件夹排行 · 待办聚合

## 工作流

- 所有修改以本地仓库 (`obsidian/github/obsidian-note-dashboard/`) 为准，远程只是镜像
- 不添加多余注释到代码中

## 自定义命令

重复性任务优先使用：
- `/release` — 完整发版流程（更新看板 → release notes → 同步 README → tag 推送）
- `/sync-docs` — 同步 README.md ↔ README_EN.md
- `/review` — 审查看板代码质量

## Git 约定

- 类型前缀：`feat:` / `fix:` / `chore:` / `docs:` / `release:`
- 版本 tag：`v{major}.{minor}.{patch}`
