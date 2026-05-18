---
description: 管理 Obsidian Note Dashboard 的发版全流程：更新看板 → 写 release notes → 同步 README → 打 tag 推送
mode: subagent
---

## 前置检查

- 当前在 `main` 分支，工作区干净
- `📊-我的笔记看板.md` 已更新完毕

## 发版步骤

### Step 1: 创建 Release Notes

读 `release/` 目录确认命名格式，创建 `RELEASE-v{version}.md`：

```
# Release v{x}.{y}.{z} — 一句话标题

## ✨ 新特性
## 🌀 优化
## 🐛 修复

---

**文件**: 📊-我的笔记看板.md · {行数} 行
```

### Step 2: 更新 README

在两个 README 的更新日志区顶部追加新版本条目，同步中英文，更新 badge 行数。

### Step 3: 提交并推送

```bash
git add -A
git commit -m "release: v{version} — 标题"
git tag v{version}
git push && git push origin v{version}
```

### Step 4: 上传 Release 附件

将看板文件重命名为 `obsidian-note-dashboard-v{version}.md`（英文名，避免中文/emoji）上传为附件。
