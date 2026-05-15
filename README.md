# Obsidian Note Dashboard

一个基于 DataviewJS 的笔记统计看板。GitHub 风格热力图 + 写作统计 + 文件夹排行 + 待办聚合，全部写在一个 `.md` 文件里。
<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/48f67b85-aa4a-4857-9d1c-9e96945a0655" width="360"></td>
    <td><img src="https://github.com/user-attachments/assets/179abf20-b509-42b0-b927-f0054648fdfb" width="360"></td>
  </tr>
</table>


## 功能

**🔥 近一年贡献热力图**
按每日写入字数着色（5级绿色），月份标签左侧冻结，支持横向滚动。响应明暗主题切换。

**📊 统计总览**
6张卡片 + 本月活跃进度条：笔记总数、总字数、活跃天数、今日已写字数、当前连续天数、文件夹数。

**📆 月度统计**
每月笔记数 + 字数进度条，当前月份高亮标记，支持12个月数据展示。

**📁 文件夹排行榜**
按字数降序排列，每条带百分比进度条和🥇🥈🥉标记，一眼看出哪个文件夹最活跃。

**📋 待办看板**
聚合所有未完成任务，按所在文件分组，≤6项的组默认展开，超过则折叠。

## 使用方法

1. 安装 [Dataview](https://github.com/blacksmithgu/obsidian-dataview) 插件，确保设置中 **Enable JavaScript Queries** 已开启
2. 下载 `📊-我的笔记看板.md`（或你重命名的文件），放入 Obsidian 库任意位置
3. 在 Obsidian 中打开该文件，等待 Dataview 索引完成即可

## 依赖

- Obsidian 本体
- [Dataview](https://github.com/blacksmithgu/obsidian-dataview) 插件（必需，JavaScript查询模式）

无其他外部依赖或 API 密钥。

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

在 3 个 `dataviewjs` 代码块的开头都有这行：

```javascript
const EXCLUDE = ['附件', '模板', 'copilot'];
```

按需增删即可。

### 修改热力图颜色

找到 `L`（浅色）和 `D`（深色）对象，替换色值：

```javascript
const L = { e:'#ebedf0', c1:'#c8e6d0', c2:'#6cc085', c3:'#3a9d5e', c4:'#1f6e3a' };
const D = { e:'#2d333b', c1:'#1a5435', c2:'#2b7448', c3:'#409660', c4:'#57ab76' };
```

### 启用成长计划

如果你在 `planning/成长计划.md` 中维护了带 `- [x]` / `- [ ]` 格式的任务清单，统计总览区域会自动读取并显示完成进度条。

## License

MIT
