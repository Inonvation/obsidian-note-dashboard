# OpenCode Configuration

Obsidian Note Dashboard 的 OpenCode 配置仓库，包含 agent、skill、command 和规则定义。

## 目录结构

```
opencode-config/
├── .opencode/                # 工作流配置
│   ├── agent/                # Agent 角色定义
│   │   ├── release-manager.md
│   │   ├── code-review.md
│   │   ├── docs-sync.md
│   │   └── obsidian-dev.md
│   ├── skills/               # Skill 流程定义
│   │   └── obsidian-release/
│   │       └── SKILL.md
│   └── command/              # 快捷命令
│       ├── release.md
│       ├── review.md
│       └── sync-docs.md
├── CONFIG_RULES.md           # 规则和约束
├── opencode.json             # OpenCode 配置
├── .gitignore                # Git 忽略规则
└── README.md                 # 本文
```

## 使用方式

### 方式 1：直接使用（推荐）

将整个目录复制到工作根目录：

```powershell
Copy-Item -Recurse opencode-config/.opencode /path/to/workspace/
Copy-Item opencode-config/CONFIG_RULES.md /path/to/workspace/
Copy-Item opencode-config/opencode.json /path/to/workspace/
```

### 方式 2：Symlink

```powershell
New-Item -ItemType SymbolicLink -Path "/path/to/workspace/.opencode" -Target "opencode-config/.opencode"
New-Item -ItemType SymbolicLink -Path "/path/to/workspace/CONFIG_RULES.md" -Target "opencode-config/CONFIG_RULES.md"
New-Item -ItemType SymbolicLink -Path "/path/to/workspace/opencode.json" -Target "opencode-config/opencode.json"
```

## Agent 说明

| Agent | 职责 |
|-------|------|
| release-manager | 管理发版流程 |
| code-review | 代码审查专家 |
| docs-sync | 文档同步专家 |
| obsidian-dev | Obsidian 开发专家 |

## Skill 说明

| Skill | 触发词 | 功能 |
|-------|--------|------|
| obsidian-release | 发布、release、发版、新版本、上线 | 完整发版流程 |

## Command 说明

| Command | 功能 |
|---------|------|
| /release | 发布新版本 |
| /review | 代码审查 |
| /sync-docs | 文档同步 |

## 配置说明

- **CONFIG_RULES.md**：定义规则和约束（什么能做，什么不能做）
- **opencode.json**：定义 MCP 服务和权限
- **Agent**：定义角色和权限（谁来做）
- **Skill**：定义具体流程（怎么做）
- **Command**：定义快捷命令（如何触发）

## 版本控制

本仓库使用 Git 进行版本控制，配置变更有历史记录。

## 许可证

MIT License