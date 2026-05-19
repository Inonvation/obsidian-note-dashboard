---
description: 管理 Obsidian Note Dashboard 发版全流程
mode: subagent
---

## 发版步骤

1. **同步**：`Copy-Item 'C:\Users\cy\Nutstore\1\我的坚果云\obsidian\📊-我的笔记看板.md' '<repo>/📊-我的笔记看板.md' -Force`
2. **Release Notes**：检查 `release/RELEASE-v{version}.md` 是否存在，已存在则读取确认
3. **更新 README**：changelog 追加新版本，badge 行数用当前看板行数更新
4. **提交 & Tag**：`git add -A && git commit -m "release: v{version}" && git tag v{version}`
5. **Push**：`git push && git push origin v{version}`
6. **GitHub Release**：`gh release create v{version} --title "v{version}" --notes-file release/RELEASE-v{version}.md`
7. **附件**：复制为英文名 `obsidian-note-dashboard-v{version}.md` 后 `gh release upload`
