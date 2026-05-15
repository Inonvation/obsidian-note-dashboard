# Obsidian Note Dashboard

<p align="center">
  <a href="README_EN.md"><img src="https://img.shields.io/badge/English-1982d2?style=flat&logo=readme&logoColor=white"></a>
  <a href="#"><img src="https://img.shields.io/badge/中文-d63031?style=flat&logo=readme&logoColor=white"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Obsidian-7C3AED?style=flat&logo=obsidian&logoColor=white">
  <img src="https://img.shields.io/badge/DataviewJS-FF6B6B?style=flat&logo=javascript&logoColor=white">
  <img src="https://img.shields.io/github/v/release/Inonvation/obsidian-note-dashboard?style=flat&label=release">
  <img src="https://img.shields.io/github/stars/Inonvation/obsidian-note-dashboard?style=flat&logo=github&label=stars">
  <img src="https://img.shields.io/github/last-commit/Inonvation/obsidian-note-dashboard?style=flat&logo=git&label=更新">
  <img src="https://img.shields.io/github/issues/Inonvation/obsidian-note-dashboard?style=flat&logo=github&label=issues">
  <img src="https://img.shields.io/badge/license-MIT-blue">
</p>

<p align="center">
  <b>📊 一个基于 DataviewJS 的笔记统计看板</b><br>
  <sub>GitHub 风格热力图 · 写作统计 · 文件夹排行 · 待办聚合 · 全部写在一个 `.md` 文件里</sub>
</p>

---

## 📖 目录

- [效果预览](#-效果预览)
- [功能介绍](#-功能介绍)
- [依赖](#-依赖)
- [使用方法](#-使用方法)
- [自定义](#-自定义)
- [相似项目](#-相似项目)
- [参与贡献](#-参与贡献)
- [许可证](#-许可证)

---

## 🖼️ 效果预览

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

---

## ✨ 功能介绍

**🔥 近一年贡献热力图**
按每日写入字数着色（5级绿色渐变），月份标签左侧冻结，支持横向滚动。自动适配浅色/深色主题。

**📊 统计总览**
6张统计卡片 + 本月活跃进度条：笔记总数、总字数、活跃天数、今日已写字数、当前连续天数、文件夹数。

**📆 月度统计**
每月笔记数 + 字数进度条，当前月份高亮标记，最多支持 12 个月数据展示。

**📁 文件夹排行榜**
按总字数降序排列，每条带百分比进度条和 🥇🥈🥉 奖牌标记，一眼看出哪个文件夹最活跃。

**📋 待办看板**
聚合所有未完成任务，按所在文件分组。≤6 项的组默认展开，超过则折叠，保持页面清爽。

**📱 全平台适配**
响应式表格布局在手机、平板、桌面端均可正常显示，热力图在移动端支持触控横向滚动。

---

## 📦 依赖

| 软件 | 版本要求 | 说明 |
|---|---|---|
| [Obsidian](https://obsidian.md) | 0.15+ | 笔记软件本体 |
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | 0.5+ | 必需，**JavaScript Queries** 需在设置中开启 |

> ✅ 无外部 API、无需 API 密钥、无付费服务。

---

## 🚀 使用方法

### 1. 安装 Dataview 插件

```
Obsidian → 设置 → 社区插件 → 浏览 → 搜索 "Dataview" → 安装 → 启用
```

进入 Dataview 设置页，勾选 **"Enable JavaScript Queries"**。

### 2. 添加看板文件

将 `📊-我的笔记看板.md` 下载到你的 Obsidian 库任意位置（根目录或子文件夹均可，代码会自动适配路径）。在 Obsidian 中打开该文件，等待几秒让 Dataview 完成索引。

> 💡 **首次打开显示空白？** 在命令面板（Ctrl/Cmd + P）中执行 `Dataview: Force refresh all views` 即可。

### 3. （可选）设为主页

在 Obsidian 设置中将其设为默认启动文件，或使用 [Homepage](https://github.com/mirnovs/obsidian-homepage) 等主页插件嵌入该文件。

---

## 🎨 自定义

所有可调参数集中在各个 `dataviewjs` 代码块的顶部：

| 参数 | 位置 | 说明 |
|---|---|---|
| `EXCLUDE` | 3 个代码块开头 | 排除的文件夹名，默认排除 `附件`、`模板`、`copilot` |
| `L` / `D`（各 4 个颜色） | 热力图代码块 | 浅色/深色主题的 5 级颜色色板 |
| `COLORS` | 统计总览代码块 | 月度进度条的 8 色数组 |
| `C` / `G` / `R` | 热力图代码块 | 格子大小/间距/圆角半径（像素） |
| `DAYS` | 热力图代码块 | 左侧星期标签，默认只显示一、三、五 |

### 排除特定文件夹

```javascript
const EXCLUDE = ['附件', '模板', 'copilot'];
```

按需增删即可。

### 修改热力图颜色

```javascript
const L = { e:'#ebedf0', c1:'#c8e6d0', c2:'#6cc085', c3:'#3a9d5e', c4:'#1f6e3a' };
const D = { e:'#2d333b', c1:'#1a5435', c2:'#2b7448', c3:'#409660', c4:'#57ab76' };
```

### 启用成长计划

如果 `planning/成长计划.md` 中存在 `- [x]` / `- [ ]` 格式的任务清单，看板会自动读取并显示完成进度条。

---

## 🔗 相似项目

| 项目 | 差异 |
|---|---|
| [vran-dev/obsidian-contribution-graph](https://github.com/vran-dev/obsidian-contribution-graph) ⭐432 | 独立插件，热力图交互更强，但不含统计 Dashboard |
| [InlitX/Obsidian-Dashboard-Gallery](https://github.com/InlitX/Obsidian-Dashboard-Gallery) | 侧重视觉设计和布局，不统计字数/文件夹分布 |
| [yirsi/obsidian-habit-heatmap](https://github.com/yirsi/obsidian-habit-heatmap) | 带游戏化系统的习惯追踪，与笔记写作统计不同方向 |

---

## 🤝 参与贡献

欢迎任何形式的贡献！

- 🐛 提交 [Issue](https://github.com/Inonvation/obsidian-note-dashboard/issues) 报告 Bug 或提出功能建议
- 🔀 提交 Pull Request 改进代码
- ⭐ 点亮 Star 让更多人看到这个项目

---

## ⭐ Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=Inonvation/obsidian-note-dashboard&type=Date)](https://star-history.com/#Inonvation/obsidian-note-dashboard&Date)

---

## 📄 许可证

本项目基于 MIT 许可证开源，详情见 [LICENSE](./LICENSE) 文件。

<p align="center">
  <sub>为 Obsidian 社区用心打造 ❤️</sub>
  <br>
</p>
```
