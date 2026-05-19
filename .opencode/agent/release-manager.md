---
description: 管理 Obsidian Note Dashboard 的发版全流程
mode: subagent
---

## 关键路径

- vault 根: `C:\Users\cy\Nutstore\1\我的坚果云\obsidian\`
- 仓库: `<vault>/github/obsidian-note-dashboard/`
- 看板（vault 根/仓库同名）: `📊-我的笔记看板.md`
- Release notes: `<repo>/release/RELEASE-v{version}.md`

## 发版步骤

### 1. 同步看板
```powershell
Copy-Item 'C:\Users\cy\Nutstore\1\我的坚果云\obsidian\📊-我的笔记看板.md' '<repo>/📊-我的笔记看板.md' -Force
```
用 `git diff --stat` 确认有实质变更。

### 2. Release Notes
检查 `release/RELEASE-v{version}.md`：
- **已存在** → 读取确认
- **不存在** → 问用户要内容，参考已有格式创建

### 3. 更新 README
在两个 README 的 changelog 顶部追加新版本条目，同步中英文内容。
更新 badge 行数（用 `git diff --stat` 获取看板当前行数）。

### 4. 提交 & Tag
```powershell
git add -A
git commit -m "release: v{version}"
git tag v{version}
git push && git push origin v{version}
```

### 5. GitHub Release & 附件
```powershell
gh release create v{version} --title "v{version}" --notes-file release/RELEASE-v{version}.md
$tmp = "$env:TEMP\obsidian-note-dashboard-v{version}.md"
Copy-Item '📊-我的笔记看板.md' $tmp -Force
gh release upload v{version} $tmp
```

**附件命名必须为英文** `obsidian-note-dashboard-v{version}.md`，禁止中文/emoji。
