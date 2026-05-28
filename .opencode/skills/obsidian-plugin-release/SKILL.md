---
name: obsidian-plugin-release
description: 一键发布Obsidian插件到GitHub Release。当用户提到发布v1.x.x、release、发布插件、发布新版本、upload release等关键词时触发。自动执行预检查、更新版本号、git提交推送。
---

# Obsidian Plugin Release

## Workflow

### 1. 解析用户输入

从用户消息中提取：
- 版本号（如 v1.1.0）
- 更新日志/说明

如果没有提供版本号：自动递增当前版本号的 patch 版本（1.0.0 → 1.0.1）

### 2. 预检查（发布前验证）

```bash
cd plugin
npm run typecheck
npm run lint
npm run build
```

如果有错误：告知用户具体错误，询问是否继续发布（跳过检查）

### 3. 更新版本号

更新以下文件的 version 字段：
- `plugin/manifest.json`
- `plugin/package.json`

```powershell
(Get-Content plugin/manifest.json -Raw) | ConvertFrom-Json | ForEach-Object { $_.version = "<版本号>" } | ConvertTo-Json | Set-Content plugin/manifest.json
(Get-Content plugin/package.json -Raw) | ConvertFrom-Json | ForEach-Object { $_.version = "<版本号>" } | ConvertTo-Json | Set-Content plugin/package.json
```

### 4. Git 操作

```bash
git add .
git commit -m "v<版本号>: <更新日志>"
git tag v<版本号>
git push --tags
```

### 5. 确认发布

告诉用户：版本号已更新、代码已推送到 GitHub、GitHub Actions 正在自动构建、几分钟后可在 Releases 页面下载。

## Example

```
User: 发布 v1.1.0，更新日志：新增深色模式支持
→ 执行预检查（typecheck, lint, build）
→ 更新 plugin/manifest.json 和 plugin/package.json 版本号为 "1.1.0"
→ git commit -m "v1.1.0: 新增深色模式支持"
→ git tag v1.1.0
→ git push --tags
→ 告知用户发布已触发
```

## Notes

- 版本号格式：v1.2.3（带 v 前缀）
- 预检查失败时询问用户是否继续
- GitHub Actions 会自动构建并上传 main.js, manifest.json, styles.css
- 如果 git push 失败，检查远程连接和 token 权限