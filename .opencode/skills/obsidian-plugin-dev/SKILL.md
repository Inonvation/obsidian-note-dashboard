# Skill: Obsidian Plugin Dev

开发 Obsidian 插件时的辅助工具。

## Trigger

当用户提到以下关键词时触发：
- "启动开发"
- "开始开发"
- "dev 模式"
- "npm run dev"
- "刷新插件"
- "重新构建"
- "打开 obsidian"
- "检查代码"
- "类型检查"
- "lint"

## Workflow

### 1. 启动开发模式

当用户说"启动开发"或"dev 模式"：

```bash
cd plugin
npm run dev
```

这会启动 esbuild 监听模式，自动监控 src/ 目录下的文件变化并重新构建 main.js。

**注意**：这是长时间运行的命令，使用 background 模式执行。

### 2. 刷新插件

当用户说"刷新插件"或"重新构建"：

```bash
cd plugin
npm run build
```

然后告诉用户：
- 构建完成
- 需要在 Obsidian 中手动刷新插件（设置 → 第三方插件 → 关闭再打开 Note Dashboard）

### 3. 检查代码

当用户说"检查代码"、"类型检查"或"lint"：

**完整检查**：
```bash
cd plugin
npm run typecheck    # TypeScript 类型检查
npm run lint         # ESLint 代码规范检查
```

**只检查类型**：
```bash
cd plugin
npm run typecheck
```

**只检查规范**：
```bash
cd plugin
npm run lint
```

告诉用户：
- 检查结果
- 有多少警告/错误
- 具体问题位置

### 4. 打开 Obsidian

当用户说"打开 obsidian"：

根据用户配置的 vault 路径打开 Obsidian：
```powershell
Start-Process "obsidian://open?vault=<vault名称>"
```

或直接告诉用户手动打开 Obsidian。

## 项目路径

- 插件源码：`plugin/`
- 构建输出：`plugin/main.js`
- Obsidian 测试 vault：根据用户配置

## Notes

- dev 模式会在后台持续运行
- 文件保存后会自动重新构建
- 构建完成后需要在 Obsidian 中刷新插件才能看到效果
- 类型检查和 lint 可以帮助发现潜在问题
