---
name: code-review
description: DataviewJS 代码审查。当用户提到"审查"、"review"、"代码质量"时触发。
license: MIT
compatibility: opencode
metadata:
  category: workflow
  workflow: code-review
  version: 1.0.0
---

# Code Review Workflow

## 触发条件

用户提到以下关键词时触发：
- 审查、review、代码质量、代码审查

## 审查维度

### 代码质量
- 命名语义化
- 无死代码/冗余逻辑
- 无 NaN/undefined 隐患

### 性能
- 查询高效避免全库遍历后过滤
- 动画防抖节流
- DOM 批量操作
- `__ndRenderedKey` 缓存合理

### 兼容性
- 浅色/深色主题适配
- 移动端手势优化
- Obsidian 版本兼容

### 安全性
- 避免泄露路径
- 不读写 `dv.app` 私有 API

## 输出格式

```
## 代码审查报告

### 通过项 ✅
- [项目描述]

### 警告项 ⚠️
- `文件路径/行号` → 类型（性能/风格）→ 修改建议

### 错误项 ❌
- `文件路径/行号` → 类型（bug/安全）→ 修改建议
```

## 错误处理

| 错误场景 | 处理方式 |
|----------|----------|
| 文件不存在 | 提示用户检查文件路径 |
| 代码块不存在 | 提示用户检查 DataviewJS 代码块 |