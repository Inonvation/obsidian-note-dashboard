---
name: obsidian-dev
description: Obsidian DataviewJS 开发。当用户提到"开发"、"开发专家"、"DataviewJS"时触发。
license: MIT
compatibility: opencode
metadata:
  category: workflow
  workflow: development
  version: 1.0.0
---

# Obsidian Development Workflow

## 触发条件

用户提到以下关键词时触发：
- 开发、开发专家、DataviewJS、看板开发

## 项目结构

- 工作根目录: `C:\Users\cy\Nutstore\1\我的坚果云\obsidian\github\obsidian-note-dashboard\`
- 看板主文件: `📊-我的笔记看板.md` — 单源，项目根下
- 修改规则: `C:\Users\cy\Nutstore\1\我的坚果云\obsidian\_rules\看板修改规则.md`
- Agent 配置: `.opencode/`

**所有代码在 `📊-我的笔记看板.md` 的 ````dataviewjs` 代码块中。**

## 项目代码规范

- 可调参数统一在 `C` 对象顶部定义
- CSS 类名以 `nd-` 为前缀，全局样式注入到 `#nd-style` 元素中
- `__ndRenderedKey` 标记防重复动画，CSS 只负责 transition/animation
- 首次渲染 vs re-execution 路径分离
- 兼容浅色/深色主题（`C.isDark()`）
- 保持单文件架构，避免全局变量污染
- 修改前需先读 vault 根的 `_rules/看板修改规则.md`

## 动画系统

四种入场动画（~1.5s 总时长）：
1. 热力图逐列淡入（30ms 间隔）
2. 卡片四向滑入（80ms 间隔）
3. 进度条从零填满（600ms）
4. 数字从 0 递增弹入（800ms）

## 执行步骤

### Step 1: 读取规则

```
输入：无
处理：
  1. 读取 `_rules/看板修改规则.md`
  2. 理解修改规则
输出：规则内容
```

### Step 2: 分析需求

```
输入：用户需求
处理：
  1. 分析需求
  2. 确定实现方案
输出：实现方案
```

### Step 3: 实现代码

```
输入：实现方案
处理：
  1. 编写代码
  2. 遵循代码规范
输出：代码实现
```

### Step 4: 测试验证

```
输入：代码实现
处理：
  1. 测试功能
  2. 验证兼容性
输出：测试结果
```

## 输出格式

```
## 开发报告

### 实现方案
- [方案描述]

### 代码变更
- [变更描述]

### 测试结果
- [测试结果]
```

## 错误处理

| 错误场景 | 处理方式 |
|----------|----------|
| 文件不存在 | 提示用户检查文件路径 |
| 规则不明确 | 提示用户确认规则 |