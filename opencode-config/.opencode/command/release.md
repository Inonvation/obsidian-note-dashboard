---
description: 发布新版本到 GitHub
usage: release [version]
examples:
  - release v2.1.2
  - release
---

# 发布命令

加载 `obsidian-release` skill 执行完整发版流程。

## 参数

- `version`（可选）：版本号，格式为 `v{major}.{minor}.{patch}`
  - 如未提供，会询问用户

## 执行流程

1. 加载 `obsidian-release` skill
2. 按 skill 定义的流程执行
3. 输出 skill 定义的输出格式

## 示例

```
# 指定版本号发布
release v2.1.2

# 交互式发布（会询问版本号）
release
```

## 注意事项

- 发布前请确保所有更改已提交
- 需要 GitHub CLI (`gh`) 已登录
- 附件命名必须为英文