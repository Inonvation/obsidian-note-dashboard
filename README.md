<p align="center">
  <a href="README_EN.md"><img src="https://img.shields.io/badge/English-1982d2?style=flat&logo=readme&logoColor=white"></a>
  <a href="#"><img src="https://img.shields.io/badge/中文-d63031?style=flat&logo=readme&logoColor=white"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Obsidian-0.15+-%23483699?style=flat-square&logo=obsidian">
  <img src="https://img.shields.io/badge/Dataview-0.5+-%234a9c6d?style=flat-square&logo=dataview">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
  <a href="https://github.com/Inonvation/obsidian-note-dashboard/releases">
    <img src="https://img.shields.io/github/v/release/Inonvation/obsidian-note-dashboard?style=flat-square&color=orange">
  </a>
  <img src="https://img.shields.io/badge/single--file-1622%20lines-brightgreen?style=flat-square">
</p>

<h1 align="center">Obsidian Note Dashboard</h1>
<p align="center">基于 DataviewJS 的笔记统计看板 -- 热力图 · 写作统计 · 文件夹排行 · 待办聚合</p>

---

[效果预览](#preview) · [功能特性](#features) · [设置面板](#settings) · [动画效果](#animations) · [依赖](#dependencies) · [使用方法](#usage) · [更新日志](#changelog)

---

## <a name="preview"></a> 效果预览

<table align="center">
  <tr>
    <td align="center" width="50%" style="padding:8px;">
      <img src="https://github.com/user-attachments/assets/48f67b85-aa4a-4857-9d1c-9e96945a0655" 
           width="90%"
           style="border:1px solid #e1e4e8; border-radius:10px;">
      <br><strong style="color:#6366f1;">热力图 · 文件夹排行</strong>
      <br><span style="color:#586069;font-size:13px;">近一年贡献 · 词数奖牌排行</span>
    </td>
    <td align="center" width="50%" style="padding:8px;">
      <img src="https://github.com/user-attachments/assets/179abf20-b509-42b0-b927-f0054648fdfb" 
           width="90%"
           style="border:1px solid #e1e4e8; border-radius:10px;">
      <br><strong style="color:#10b981;">统计总览 · 待办看板</strong>
      <br><span style="color:#586069;font-size:13px;">笔记总数 · 活跃天数 · 待办聚合</span>
    </td>
  </tr>
</table>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6cae2aa5-905b-4bf3-8171-2f65adaffb1a" 
       width="90%"
       style="border:1px solid #e1e4e8; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <br><em style="color:#586069;">桌面端 · 全功能看板</em>
</p>

---

## <a name="features"></a> 功能特性

<table>
<tr>
<td width="33%">

**<span style="color:#6366f1;">热力图</span>**

54 列滑动窗口，5 级渐变着色，横向滚动，懒加载渲染

</td>
<td width="33%">

**<span style="color:#10b981;">统计总览</span>**

6 张卡片 + 本月活跃进度条，数字弹入动画

</td>
<td width="34%">

**<span style="color:#f59e0b;">柱状图</span>**

月度/近 7 天切换，Y 轴自动取整，升起过渡动画

</td>
</tr>
<tr>
<td>

**<span style="color:#f43f5e;">文件夹排行</span>**

列表/饼图双视图，防碰撞算法，扇形展开动画

</td>
<td>

**<span style="color:#0ea5e9;">成长进度</span>**

自动检测成长计划，渐变进度条，流光扫光动画

</td>
<td>

**<span style="color:#f97316;">待办看板</span>**

按文件分组，优先级/到期日标记，点击直接完成

</td>
</tr>
<tr>
<td>

**<span style="color:#64748b;">设置面板</span>**

7 种配色一键切换，所有配置可视化调整

</td>
<td>

**<span style="color:#8b5cf6;">平滑渲染</span>**

强制阅读模式，消除闪烁，二次渲染秒开

</td>
<td>

**<span style="color:#14b8a6;">全平台适配</span>**

响应式布局，手机/平板/桌面均可正常使用

</td>
</tr>
</table>

---

## <a name="settings"></a> 设置面板

点击看板右上角齿轮图标打开，所有配置实时预览，保存后立即生效。

| 配色方案 | Indigo | Emerald | Amber | Rose | Sky | Coral | Slate |
|:--------|:------:|:-------:|:-----:|:----:|:---:|:-----:|:-----:|
| 主色调 | <span style="color:#6366f1;">`#6366f1`</span> | <span style="color:#10b981;">`#10b981`</span> | <span style="color:#f59e0b;">`#f59e0b`</span> | <span style="color:#f43f5e;">`#f43f5e`</span> | <span style="color:#0ea5e9;">`#0ea5e9`</span> | <span style="color:#f97316;">`#f97316`</span> | <span style="color:#64748b;">`#64748b`</span> |

**可配置项：** 排除文件夹 · 排行数量 · 待办展开组数 · 成长计划路径 · 优先级标签 · 到期日标记 · 估算阈值 · 估算系数

所有配置可通过 Frontmatter YAML 自定义，配色方案通过 localStorage 持久化。

---

## <a name="animations"></a> 动画效果

| 动画 | 时长 | 说明 |
|:-----|:----:|:-----|
| 热力图逐列淡入 | 30ms/列 | 从旧到新逐列出现 |
| 卡片四向滑入 | 0.5s | 上下左右弹性缓动入场 |
| 数字弹入 | 0.8s | 从 0 递增，缩放脉冲效果 |
| 进度条填充 | 0.6s | 从零填满，ease-out 缓出 |
| 柱状图升起 | 1.2s | 从 0 升到目标高度 |
| 饼图扇形展开 | 0.85s | 扇形扫描展开 |

---

## <a name="dependencies"></a> 依赖

| 软件 | 版本 |
|:-----|:----:|
| [Obsidian](https://obsidian.md) | 0.15+ |
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | 0.5+ |

> 无外部 API，无付费服务，数据完全在本地。

---

## <a name="usage"></a> 使用方法

1. **安装 Dataview** -- 设置 -> 社区插件 -> 搜索 "Dataview" -> 安装 -> 启用
2. **开启 JavaScript** -- Dataview 设置页勾选 `Enable JavaScript Queries`
3. **下载看板** -- 从 [Release](https://github.com/Inonvation/obsidian-note-dashboard/releases) 下载 `.md` 文件，放到库任意位置
4. **打开看板** -- 在 Obsidian 中打开文件，等待 Dataview 索引完成

> 首次空白？执行 `Dataview: Force refresh all views` 即可。

---

## <a name="changelog"></a> 更新日志

### <span style="color:#6366f1;">v2.2.0（2026-05-27）</span>

**新功能**
- 新增可视化设置面板：点击看板右上角齿轮图标即可打开
- 7 套配色方案：靛蓝、翠绿、琥珀、玫红、天空蓝、珊瑚橙、石板灰
- Frontmatter 配置支持：所有设置项可通过笔记头部的 YAML 属性自定义
- 帮助提示：设置面板中非显而易见的选项带有问号图标，悬停显示说明

**性能优化**
- 加载容错：单个笔记加载失败不再导致整个看板崩溃
- 任务排序优化：大量待办任务的排序速度提升
- 标记完成可靠性：任务标记失败时自动恢复
- 计划解析增强：成长计划支持更多 Markdown 列表格式

**代码重构**
- 提取公共动画函数：折叠/展开动画逻辑统一，减少约 80 行重复代码
- 配置系统重构：所有硬编码的个人化设置统一为可配置项

### <span style="color:#10b981;">v2.1.1（2026-05-26）</span>
- 展开/折叠改为精确高度过渡，消除视觉卡顿与页面跳动
- 饼图居中，新增标签防碰撞与直线引线
- 全部展开/收起采用交错动画，防止布局骤变
- 修复待办看板进度条懒加载不显示及按钮状态异常

### <span style="color:#f59e0b;">v2.1.0（2026-05-24）</span>
- 性能优化：热力图/待办看板懒加载，首屏渲染更快
- 饼图/柱状图按需生成：切换视图时才构建，减少初始开销
- 错误边界：异常时显示友好提示，防止看板空白

### <span style="color:#f43f5e;">v2.0.0（2026-05-22）</span>
- 待办看板重构：改为按文件分组布局，支持展开/收起
- 优先级标记：`!!` 紧急（闪烁）、`!` 重要
- 到期日解析：支持 `📅 YYYY-MM-DD`，自动标记逾期/今日到期/即将到期
- 近七天词数统计：月度/七天视图切换
- 文件夹饼图：列表/饼图双视图模式

<details>
<summary>历史版本</summary>

| 版本 | 日期 | 要点 |
|:----|:----:|:-----|
| v1.4.2 | 2026-05-19 | 修复热力图统计错误、深色模式预览切换 bug |
| v1.4.1 | 2026-05-18 | 修复卡死、二次渲染抖动、移动端首次启动问题 |
| v1.4.0 | 2026-05-18 | 平滑渲染引擎，消除闪烁；全宽布局；动画 JS 控制 |
| v1.3.0 | 2026-05-17 | 热力图 54 列滑动窗口，颜色阈值调整 |
| v1.2.0 | 2026-05-16 | 自动切换阅读模式，4 种入场动画 |
| v1.1.0 | 2026-05-16 | 全局配置 `C` 对象，中文/英文分词 |

</details>

---

## 许可证

本项目基于 **MIT 许可证** 开源。