# Skill: Obsidian Plugin Release

一键发布 Obsidian 插件到 GitHub Release。

## Trigger

当用户提到以下关键词时触发：
- "发布 v1.x.x"
- "release v1.x.x"
- "发布插件"
- "发布新版本"
- "upload release"

## Workflow

### 1. 解析用户输入

从用户消息中提取：
- 版本号（如 v1.1.0）
- 更新日志/说明

**如果没有提供版本号**：自动递增当前版本号的 patch 版本
- 当前 1.0.0 → 自动变为 1.0.1
- 当前 1.0.9 → 自动变为 1.0.10

### 2. 预检查（发布前验证）

在发布前执行以下检查：

```bash
cd plugin
npm run typecheck    # TypeScript 类型检查
npm run lint         # ESLint 代码规范检查
npm run build        # 构建测试
```

**如果有错误**：
- 告知用户具体错误
- 询问是否继续发布（跳过检查）

### 3. 更新版本号

更新以下文件的 version 字段：
- `plugin/manifest.json`
- `plugin/package.json`

使用 PowerShell：
```powershell
cd plugin
(Get-Content manifest.json -Raw) | ConvertFrom-Json | ForEach-Object { $_.version = "<版本号>" } | ConvertTo-Json | Set-Content manifest.json
(Get-Content package.json -Raw) | ConvertFrom-Json | ForEach-Object { $_.version = "<版本号>" } | ConvertTo-Json | Set-Content package.json
```

### 4. Git 操作

```bash
cd <项目根目录>
git add .
git commit -m "v<版本号>: <更新日志>"
git tag v<版本号>
git push --tags
```

### 5. 确认发布

告诉用户：
- 版本号已更新
- 代码已推送到 GitHub
- GitHub Actions 正在自动构建
- 几分钟后可在 Releases 页面下载

## Example Interactions

**Example 1: 指定版本号**
```
User: 发布 v1.1.0，更新日志：新增深色模式支持
Assistant:
1. 执行预检查（typecheck, lint, build）
2. 更新 plugin/manifest.json 和 plugin/package.json 版本号为 "1.1.0"
3. git commit -m "v1.1.0: 新增深色模式支持"
4. git tag v1.1.0
5. git push --tags
6. 告知用户发布已触发
```

**Example 2: 自动递增版本**
```
User: 发布插件，更新日志：修复热力图显示问题
Assistant:
1. 读取当前版本号：1.0.0
2. 自动递增为：1.0.1
3. 执行预检查
4. 更新版本号
5. git commit -m "v1.0.1: 修复热力图显示问题"
6. git tag v1.0.1
7. git push --tags
```

## Notes

- 版本号格式：v1.2.3（带 v 前缀）
- 预检查失败时询问用户是否继续
- GitHub Actions 会自动构建并上传 main.js, manifest.json, styles.css
- 如果 git push 失败，检查远程连接和 token 权限
