---
name: obsidian-release
description: Obsidian Note Dashboard 发版全流程。当用户提到"发布"/"release"/"发版"/"新版本"/"上线"时触发。
license: MIT
compatibility: opencode
metadata:
  category: workflow
  workflow: release
  version: 1.0.0
---

# Obsidian Release Workflow

## 触发条件

用户提到以下关键词时触发：
- 发布、release、发版、新版本、上线
- 版本号格式：`v{major}.{minor}.{patch}`

## 前置条件

| 检查项 | 命令 | 预期结果 |
|--------|------|----------|
| Git 状态 | `git status --porcelain` | 无未提交更改 |
| GH 登录 | `gh auth status` | 已登录 |
| 当前分支 | `git branch --show-current` | main 或 master |
| Tag 不存在 | `git tag -l "v{version}"` | 无输出 |

## 执行步骤

### Step 1: 版本号验证

```
输入：用户提供的版本号
处理：验证格式 v{major}.{minor}.{patch}
输出：确认版本号
```

### Step 2: Release Notes 准备

```
输入：版本号
处理：
  1. 检查 release/RELEASE-v{version}.md 是否存在
  2. 已存在 → 读取确认
  3. 不存在 → 参考已有格式创建，询问用户确认
输出：release/RELEASE-v{version}.md
```

### Step 3: README 更新

```
输入：版本号、Release Notes
处理：
  1. 读取 README.md 和 README_EN.md
  2. 在 changelog 顶部追加新版本条目
  3. 更新 badge 行数
输出：更新后的 README.md 和 README_EN.md
```

### Step 4: Git 提交

```
输入：所有更改
处理：
  1. git add -A
  2. git commit -m "release: v{version}"
  3. git tag v{version}
输出：commit 和 tag
```

### Step 5: Git Push

```
输入：commit 和 tag
处理：
  1. git push origin main
  2. git push origin v{version}
输出：远程仓库更新
```

### Step 6: GitHub Release

```
输入：版本号、Release Notes
处理：
  1. gh release create v{version} --title "v{version}" --notes-file release/RELEASE-v{version}.md
  2. 复制看板为英文名：Copy-Item "📊-我的笔记看板.md" "obsidian-note-dashboard-v{version}.md"
  3. 上传看板：gh release upload v{version} obsidian-note-dashboard-v{version}.md --clobber
输出：GitHub Release 创建成功
```

### Step 7: 验证

```
输入：版本号
处理：
  1. gh release view v{version}
  2. 检查看板附件是否上传成功
输出：发布成功确认
```

## 错误处理

| 错误场景 | 处理方式 |
|----------|----------|
| Git 状态有未提交更改 | 询问用户：提交/暂存/放弃 |
| GH 未登录 | 提示用户执行 `gh auth login` |
| Tag 已存在 | 询问用户：覆盖/升级版本号 |
| Git Push 失败 | 检查网络，询问是否重试 |
| GH Release 失败 | 检查权限，询问是否重试 |
| 附件上传失败 | 检查文件，询问是否重试 |

## 回滚流程

```powershell
# 1. 删除本地 tag
git tag -d v{version}

# 2. 删除远程 tag（如已推送）
git push origin :refs/tags/v{version}

# 3. 撤销 commit（如已提交）
git reset --soft HEAD~1

# 4. 删除 GitHub Release（如已创建）
gh release delete v{version} --yes
```

## 输出格式

```
## 发版完成

- 版本：v{version}
- Commit：{commit_hash}
- Release：https://github.com/Inonvation/obsidian-note-dashboard/releases/tag/v{version}
- 附件：
  - obsidian-note-dashboard-v{version}.md（看板）
```