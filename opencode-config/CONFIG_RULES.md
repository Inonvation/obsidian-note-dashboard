# OpenCode Configuration Rules

> 本文件定义 OpenCode 配置仓库的规则和约束

## 仓库目的

本仓库用于管理 OpenCode 的配置，包括 agent、skill、command 和规则定义。

## 路径分层

```
opencode-config/           ← 配置仓库根目录
├── CONFIG_RULES.md        ← 本文
├── opencode.json          ← OpenCode 配置
├── .opencode/             ← 工作流配置
│   ├── agent/             ← Agent 角色定义
│   ├── skills/            ← Skill 流程定义
│   └── command/           ← 快捷命令
└── README.md              ← 说明文档
```

## 配置管理规则

### 文件组织

- **Agent 定义**：每个 agent 一个文件，命名格式 `agent-name.md`
- **Skill 定义**：每个 skill 一个目录，包含 `SKILL.md` 文件
- **Command 定义**：每个 command 一个文件，命名格式 `command-name.md`
- **配置文件**：`opencode.json` 定义全局配置

### 版本控制

- 所有配置变更必须通过 Git 提交
- 提交信息格式：`feat: 添加新 agent` 或 `fix: 修复 skill 流程`
- 重大变更需要更新版本号

### 测试验证

- 配置变更后，应在测试环境中验证
- 使用 `/test` 命令测试新配置
- 确保 agent、skill、command 正常工作

## 权限规则

### Agent 权限

- **release-manager**：允许 git、gh、文件复制操作
- **code-review**：允许 git 查看、webfetch，禁止文件编辑
- **docs-sync**：允许 git、文件编辑、文件写入
- **obsidian-dev**：允许 git、文件编辑、文件写入

### Bash 权限

- 允许：git 操作、gh 操作、文件复制
- 询问：其他 bash 命令
- 禁止：危险操作（如 `rm -rf`）

## 安全规则

- 不提交 `.env`、密钥文件、`auth*.json`
- 不泄露 GitHub Token 和 API 密钥
- 不提交个人敏感信息

## 文档规则

- README.md 必须包含目录结构说明
- Agent、Skill、Command 必须有说明文档
- 配置变更必须更新相关文档

## 发版流程

1. 更新配置文件
2. 更新版本号（如适用）
3. 提交变更
4. 创建 tag
5. 推送到远程仓库

## 错误处理

- 配置错误：检查 YAML frontmatter 格式
- 权限错误：检查 agent 权限设置
- 流程错误：检查 skill 定义的步骤