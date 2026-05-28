# Skill: Obsidian Plugin Test

测试 Obsidian 插件是否正常工作。

## Trigger

当用户提到以下关键词时触发：
- "测试插件"
- "安装到 obsidian"
- "验证插件"
- "检查插件"

## Workflow

### 1. 测试插件

当用户说"测试插件"：

**步骤 1：预检查**
```bash
cd plugin
npm run typecheck    # TypeScript 类型检查
npm run lint         # ESLint 代码规范检查
```

**步骤 2：构建插件**
```bash
cd plugin
npm run build
```

**步骤 3：复制到 Obsidian 插件目录**
```powershell
$pluginDir = "C:\Users\cy\Nutstore\1\我的坚果云\obsidian\.obsidian\plugins\note-dashboard"
New-Item -ItemType Directory -Path $pluginDir -Force
Copy-Item "plugin\main.js" -Destination $pluginDir -Force
Copy-Item "plugin\manifest.json" -Destination $pluginDir -Force
Copy-Item "plugin\styles.css" -Destination $pluginDir -Force
```

**步骤 4：告诉用户**
- 插件已安装到 Obsidian vault
- 请重启 Obsidian 或刷新插件
- 在 设置 → 第三方插件 中启用 Note Dashboard

### 2. 验证插件

当用户说"验证插件"或"检查插件"：

**检查项目**：
- plugin/manifest.json 格式是否正确
- plugin/main.js 是否存在
- plugin/styles.css 是否存在
- 版本号是否一致

```bash
# 检查文件是否存在
Test-Path plugin/main.js
Test-Path plugin/manifest.json
Test-Path plugin/styles.css

# 检查 manifest.json 格式
Get-Content plugin/manifest.json -Raw | ConvertFrom-Json

# 检查版本号一致性
(Get-Content plugin/manifest.json -Raw).version
(Get-Content plugin/package.json -Raw).version
```

### 3. 安装到 Obsidian

当用户说"安装到 obsidian"：

执行与"测试插件"相同的步骤，但只复制文件，不执行构建。

## 测试 Vault 路径

默认路径：
```
C:\Users\cy\Nutstore\1\我的坚果云\obsidian\.obsidian\plugins\note-dashboard
```

如果用户有其他测试 vault，询问用户具体路径。

## Notes

- 每次构建后都需要重启 Obsidian 或刷新插件
- 插件目录名必须与 manifest.json 中的 id 一致
- 确保 Obsidian 已启用第三方插件
- 预检查可以帮助发现潜在问题
