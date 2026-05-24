---
description: 审查看板代码质量
usage: review
examples:
  - review
---

# 代码审查命令

加载 `code-review` skill 执行代码审查。

## 执行流程

1. 加载 `code-review` skill
2. 按 skill 定义的流程执行
3. 输出 skill 定义的输出格式

## 示例

```
# 执行代码审查
review
```

## 输出

审查报告包含：
- 通过项 ✅
- 警告项 ⚠️
- 错误项 ❌
- 修改建议