---
name: obsidian-plugin-dev
description: Obsidian插件开发辅助工具。当用户提到启动开发、dev模式、npm run dev、刷新插件、重新构建、打开obsidian、检查代码、类型检查、lint等关键词时触发。提供开发模式启动、代码构建、类型检查、ESLint检查等完整工作流。
---

# Obsidian Plugin Dev

## Workflow

### 1. 启动开发模式

当用户说"启动开发"或"dev模式"：

```bash
cd plugin
npm run dev
```

启动 esbuild 监听模式，自动监控 src/ 目录下的文件变化并重新构建 main.js。这是长时间运行的命令，使用 background 模式执行。

### 2. 刷新插件

当用户说"刷新插件"或"重新构建"：

```bash
cd plugin
npm run build
```

构建完成后告诉用户：需要在 Obsidian 中手动刷新插件（设置 → 第三方插件 → 关闭再打开 Note Dashboard）

### 3. 检查代码

当用户说"检查代码"、"类型检查"或"lint"：

```bash
cd plugin
npm run typecheck
npm run lint
```

告诉用户检查结果、有多少警告/错误、具体问题位置。

### 4. 打开 Obsidian

当用户说"打开 obsidian"：

```powershell
Start-Process "obsidian://open?vault=<vault名称>"
```

或直接告诉用户手动打开 Obsidian。

## 项目路径

- 插件源码：`plugin/`
- 构建输出：`plugin/main.js`

## Notes

- dev 模式会在后台持续运行
- 文件保存后会自动重新构建
- 构建完成后需要在 Obsidian 中刷新插件才能看到效果