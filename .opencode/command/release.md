---
description: 一键执行完整发版流程
---

@release-manager 执行发版流程。版本号格式：v{major}.{minor}.{patch}。

先确认：
1. `main` 分支且工作区干净
2. vault 根目录的看板文件是否已更新
3. `release/RELEASE-v{version}.md` 是否已存在

然后告诉我本次发版的版本号和变更范围（新特性/优化/修复），已存在的文件我会跳过。
