---
description: 管理 Obsidian Note Dashboard 的发版全流程：vault看板同步 → release notes → README → git tag → GitHub Release
mode: subagent
---

## 前置检查

- 当前在 `main` 分支，工作区干净
- 已知关键路径：
  - vault 根目录: `C:\Users\cy\Nutstore\1\我的坚果云\obsidian\`
  - 看板主文件（vault 根）: `📊-我的笔记看板.md`
  - 仓库目录: `github/obsidian-note-dashboard/`
  - 仓库看板: `github/obsidian-note-dashboard/📊-我的笔记看板.md`
  - Release notes: `github/obsidian-note-dashboard/release/`
  - 修改规则: `_rules/看板修改规则.md`

## 发版步骤

### Step 0: 同步看板文件（vault 根 → 仓库）

确认 vault 根目录的 `📊-我的笔记看板.md` 已复制到 `github/obsidian-note-dashboard/📊-我的笔记看板.md`。
用 `git diff --stat` 确认有实质变更（不是仅换行符差异）。

### Step 1: Release Notes

检查 `release/RELEASE-v{version}.md` 是否已存在：
- **已存在** → 读取内容，跳过写作
- **不存在** → 读取 `release/` 目录参考已有格式创建，内容问用户要

模板：
```
# Release v{x}.{y}.{z} — 一句话标题

## ✨ 新特性
## 🌀 优化
## 🐛 修复

---

**文件**: `📊-我的笔记看板.md` · {行数} 行
```

### Step 2: 更新 README（可选）

**先问用户是否需要更新 README**，不要默认执行。
若需要：
- 在两个 README 的更新日志区顶部追加新版本条目
- 同步中英文内容
- 更新 badge 行数（用 `git diff --stat` 获取看板行数）

### Step 3: 提交并推送

```bash
git add -A
git commit -m "release: v{version}"
git tag v{version}
git push && git push origin v{version}
```

### Step 4: 创建 GitHub Release & 上传附件

将看板文件重命名为 `obsidian-note-dashboard-v{version}.md` 上传为附件。

**方法（按优先级尝试）：**
1. `gh release create v{version} --title "v{version}" --notes-file release/RELEASE-v{version}.md` + 用 `gh release upload` 上传附件
2. 若 `gh` 不可用 → 用 GitHub API + curl/PowerShell WebClient 上传 release notes 和附件
3. API token 从 `git remote -v` 的 URL 中提取
