# Project Rules — 📊 Obsidian Note Dashboard

> 基于 DataviewJS 的单文件笔记统计看板：热力图 · 写作统计 · 文件夹排行 · 待办聚合

---

## 目录结构

```
obsidian/github/obsidian-note-dashboard/
├── 📊-我的笔记看板.md      # 主文件（DataviewJS 单文件）
├── release/                 # Release notes（RELEASE-v{x}.md）
├── README.md                # 中文说明
├── README_EN.md             # 英文说明
├── LICENSE                  # MIT 许可证
├── .gitignore               # 忽略 Obsidian 无关文件
├── AGENTS.md                # 本文件 — AI 规则与项目约定
```

---

## 同步流程（重要）

修改或发布版本时，按此顺序：

1. **先在本地更新** `obsidian/github/obsidian-note-dashboard/` 下的文件
2. **确认无误后**再 commit + push 到 GitHub
3. **发布 Release** 时同步打 tag

> 不要跳过本地 → 维护以本地仓库为准，远程只是镜像

---

## Release 流程

1. 更新 `📊-我的笔记看板.md`（如看板代码有改动）
2. 编写/更新 `release/RELEASE-v{version}.md`（简洁精炼的中文）
3. 更新 `README.md` 和 `README_EN.md` 中的更新日志 + badge 行数
4. commit 并推送：
   ```
   git add -A
   git commit -m "release: v{version} — 标题"
   git tag v{version}
   git push && git push origin v{version}
   ```
5. GitHub Release 会自动创建（或手动补充描述）

### Release Notes 格式

```
# Release v{x}.{y}.{z} — 一句话标题

## ✨ 新特性
...

## 🌀 优化
...

## 🐛 修复
...

---

**文件**: 📊-我的笔记看板.md · {行数} 行
```

---

## README 规则

- `README.md` = 中文，`README_EN.md` = 英文
- 中英文保持内容同步
- badge 中的行数（`690 lines`）随代码更新
- 发版时在更新日志区追加新版本条目

---

## Git 约定

- commit 用英文或中英双语，简洁明了
- 类型前缀：`feat:` / `fix:` / `chore:` / `docs:` / `release:`
- 版本 tag 格式：`v{major}.{minor}.{patch}`（如 `v1.4.0`）

---

## Release 附件

- 每次发版时，将 `📊-我的笔记看板.md` 上传为 Release 附件
- 附件命名使用 ASCII 英文：`obsidian-note-dashboard.md`
- 不上传中文/emoji 文件名（GitHub API 不支持 4-byte Unicode，会截断为 `-.md`）

## AI 交互规则

- 用中文回答，简洁直接不废话
- 修改文件前先完整读取，理解再改
- 不添加多余注释到代码中
- 不修改 `.git/config`、不泄露 token
- 操作前先确认涉及哪些文件，避免误改
- 所有代码改动以 `obsidian/github/obsidian-note-dashboard/` 为准
- Release 附件用英文名 `obsidian-note-dashboard.md`
