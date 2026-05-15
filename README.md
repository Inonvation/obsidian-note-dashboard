# Obsidian Note Dashboard

<p align="center">
  <a href="README_EN.md">🇬🇧 English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Obsidian-7C3AED?style=flat&logo=obsidian&logoColor=white">
  <img src="https://img.shields.io/badge/DataviewJS-FF6B6B?style=flat">
  <img src="https://img.shields.io/badge/license-MIT-blue">
</p>

一个基于 DataviewJS 的笔记统计看板。GitHub 风格热力图 + 写作统计 + 文件夹排行 + 待办聚合，全部写在一个 `.md` 文件里。

## 效果预览

<p align="center">
  <strong>📱 移动端预览</strong>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/48f67b85-aa4a-4857-9d1c-9e96945a0655" width="300">
  &emsp;
  <img src="https://github.com/user-attachments/assets/179abf20-b509-42b0-b927-f0054648fdfb" width="300">
</p>

<p align="center">
  <strong>💻 电脑端预览</strong>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6cae2aa5-905b-4bf3-8171-2f65adaffb1a" width="800">
</p>

## 功能

**🔥 近一年贡献热力图**
按每日写入字数着色（5级绿色），月份标签左侧冻结，支持横向滚动。自动适配浅色/深色主题。

**📊 统计总览**
6张卡片 + 本月活跃进度条：笔记总数、总字数、活跃天数、今日已写字数、当前连续天数、文件夹数。

**📆 月度统计**
每月笔记数 + 字数进度条，当前月份高亮标记，支持12个月数据展示。

**📁 文件夹排行榜**
按字数降序排列，每条带百分比进度条和🥇🥈🥉标记。

**📋 待办看板**
聚合所有未完成任务，按所在文件分组，≤6项的组默认展开。

**📱 全平台适配**
表格布局在手机、平板、桌面端自适应排版，热力图在移动端支持触控横向滚动。

## 依赖

| 软件 | 版本要求 | 说明 |
|---|---|---|
| [Obsidian](https://obsidian.md) | 0.15+ | 笔记软件本体 |
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | 0.5+ | 必需，**JavaScript Queries** 需在设置中开启 |

无其他外部依赖、API 密钥或付费服务。

## 使用方法

### 安装 Dataview 插件

1. 打开 Obsidian → 设置 → 社区插件 → 浏览
2. 搜索 **Dataview** 并安装
3. 启用后，进入 Dataview 设置页，勾选 **"Enable JavaScript Queries"**

### 添加看板文件

4. 下载 `📊-我的笔记看板.md` 到你的 Obsidian 库任意位置
5. 在 Obsidian 中打开该文件，等待几秒让 Dataview 完成索引
6. 若首次打开显示空白，执行一次 `Dataview: Force refresh all views`

### 可选：添加到主页

7. 在 Obsidian 设置中将其设为默认启动文件
8. 或使用其它主页插件嵌入该文件

## 自定义

所有可调参数集中在各个 `dataviewjs` 代码块顶部：

| 参数 | 位置 | 说明 |
|---|---|---|
| `EXCLUDE` | 3个代码块开头 | 排除的文件夹名，默认排除 `附件`、`模板`、`copilot` |
| `L` / `D`（4个颜色变量） | 热力图代码块 | 浅色/深色主题的 5 级颜色 |
| `COLORS` | 统计总览代码块 | 月度统计柱子的 8 色数组 |
| `C` / `G` / `R` | 热力图代码块 | 格子大小/间距/圆角（像素） |
| `DAYS` | 热力图代码块 | 左侧星期标签，默认只显示一三五 |

### 排除特定文件夹

```javascript
const EXCLUDE = ['附件', '模板', 'copilot'];
```

### 修改热力图颜色

```javascript
const L = { e:'#ebedf0', c1:'#c8e6d0', c2:'#6cc085', c3:'#3a9d5e', c4:'#1f6e3a' };
const D = { e:'#2d333b', c1:'#1a5435', c2:'#2b7448', c3:'#409660', c4:'#57ab76' };
```

### 启用成长计划

在 `planning/成长计划.md` 中维护 `- [x]` / `- [ ]` 格式的任务清单，看板会自动读取并显示完成进度条。

---

<p align="center">
  <sub>Built with ❤️ for the Obsidian community · MIT License</sub>
</p>
```
