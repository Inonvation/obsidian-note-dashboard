# Obsidian Note Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Obsidian-0.15+-%23483699?style=flat-square">
  <img src="https://img.shields.io/badge/Dataview-0.5+-%234a9c6d?style=flat-square">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
  <img src="https://img.shields.io/badge/release-v1.2.0-orange?style=flat-square">
  <img src="https://img.shields.io/badge/single--file-481%20lines-brightgreen?style=flat-square">
</p>

📊 **一个基于 DataviewJS 的笔记统计看板**  
GitHub 风格热力图 · 写作统计 · 文件夹排行 · 待办聚合 · 全平台适配

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

- **🔥 热力图** — 每日写入量 5 级绿色着色，月份冻结、横向滚动、逐列淡入
- **📊 统计总览** — 6 张小卡片：笔记数、总词数、活跃天数、今日词数、连续天数、文件夹数
- **📆 月度统计** — 每月词数进度条，当月高亮 + 「本月」脉冲标签
- **📁 文件夹排行** — 按词数降序排列，🥇🥈🥉 + 百分比进度条
- **📋 待办看板** — 按文件聚合未完成任务，≤6 项自动展开
- **🌱 成长计划** — 自动识别 `planning/成长计划.md`，展示完成进度
- **🎬 入场动画** — 4 种卡片入场 + 进度条滑动 + 热力图波纹 + 数字弹入 + 标签脉冲
- **🔄 阅读模式** — 自动切回预览，多面板不打架
- **⚡ 内容缓存** — 二次打开秒加载
- **📱 全平台适配** — 手机 / 平板 / 桌面

---

## 📦 依赖

| 软件 | 版本要求 | 说明 |
|---|---|---|
| [Obsidian](https://obsidian.md) | 0.15+ | 笔记软件本体 |
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | 0.5+ | 必需，**JavaScript Queries** 需在设置中开启 |

> ✅ 无外部 API、无需 API 密钥、无付费服务。单文件 481 行，开箱即用。

---

## 🚀 使用方法

### 1. 安装 Dataview 插件

```
Obsidian → 设置 → 社区插件 → 浏览 → 搜索 "Dataview" → 安装 → 启用
```

进入 Dataview 设置页，勾选 **"Enable JavaScript Queries"**。

### 2. 下载看板文件

从 [最新 Release](https://github.com/Inonvation/obsidian-note-dashboard/releases) 下载 `📊-我的笔记看板.md`，放到你的 Obsidian 库任意位置（根目录或子文件夹均可，代码会自动适配路径）。

### 3. 打开看板

在 Obsidian 中打开该文件，等待几秒让 Dataview 完成索引。看板会自动切换到阅读模式，展示完整数据。

> 💡 **首次打开显示空白？** 在命令面板（Ctrl/Cmd + P）中执行 `Dataview: Force refresh all views` 即可。

### 4. （可选）设为主页

在 Obsidian 设置中将其设为默认启动文件，或使用 [Homepage](https://github.com/mirnovs/obsidian-homepage) 等主页插件嵌入该文件。

---

## 🎨 自定义

所有可调参数统一集中在 `📊-我的笔记看板.md` 顶部 `C` 对象中，一目了然：

```javascript
const C = {
    exclude: ['附件', '模板', 'copilot'],   // 排除的文件夹
    days: ['', '一', '', '三', '', '五', ''], // 星期标签（空字符串不显示）
    colors: ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd','#a5b4fc','#818cf8','#6d28d9','#4f46e5'], // 月度进度条配色
    heatColors: {
        light: { e:'#ebedf0', c1:'#c8e6d0', c2:'#6cc085', c3:'#3a9d5e', c4:'#1f6e3a' },
        dark:  { e:'#2d333b', c1:'#1a5435', c2:'#2b7448', c3:'#409660', c4:'#57ab76' }
    }
};
```

### 排除特定文件夹

```javascript
C.exclude = ['附件', '模板', '日记']; // 按需修改
```

### 修改热力图颜色

```javascript
C.heatColors.light = { e:'#ebedf0', c1:'#c8e6d0', c2:'#6cc085', c3:'#3a9d5e', c4:'#1f6e3a' };
C.heatColors.dark  = { e:'#2d333b', c1:'#1a5435', c2:'#2b7448', c3:'#409660', c4:'#57ab76' };
```

### 修改月度进度条配色

```javascript
C.colors = ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd','#a5b4fc','#818cf8','#6d28d9','#4f46e5'];
```

### 启用成长计划

在库中创建 `planning/成长计划.md`，写入 `- [x]` / `- [ ]` 格式的任务清单，看板会自动检测并显示完成进度条。

---

## 🔗 相似项目

| 项目 | 差异 |
|---|---|
| [vran-dev/obsidian-contribution-graph](https://github.com/vran-dev/obsidian-contribution-graph) ⭐432 | 独立插件，热力图交互更强，但不含统计 Dashboard |
| [InlitX/Obsidian-Dashboard-Gallery](https://github.com/InlitX/Obsidian-Dashboard-Gallery) | 侧重视觉设计和布局，不统计词数/文件夹分布 |
| [yirsi/obsidian-habit-heatmap](https://github.com/yirsi/obsidian-habit-heatmap) | 带游戏化系统的习惯追踪，与笔记写作统计不同方向 |

---

## 📦 更新日志

### v1.2.0（2026-05-16）
- ✨ 自动切换阅读模式，多面板兼容
- 🎨 **动画重做**：4种卡片入场、进度条滑动、热力图逐列淡入、数字弹入、标签脉冲
- ⚡ 内容缓存机制，二次打开秒开
- 📉 代码从 521 行精简到 481 行
- 🐛 修复多面板/热力图滚动/进度条跳动等 Bug

### v1.1.0（2026-05-16）
- 🔧 全局配置统一到 `C` 对象
- 📝 词数统计优化（中文按字、英文按空格分词）
- 🎨 卡片入场动画 + hover 上浮交互
- 📐 全局 `nd-` 前缀 CSS 类名，渲染更干净
- 🐛 自动回正预览模式，隔离全局变量冲突

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

---

<p align="center">为 Obsidian 社区用心打造 ❤️</p>
```