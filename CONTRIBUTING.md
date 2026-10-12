# 推荐案例 / Contributing

欢迎任何原帖语言。网站提供中文和英文摘要，保留原作者、来源与原帖语言。

提交 [案例推荐](https://github.com/jyjyxt/awesome-rea/issues/new?template=case.yml)，或修改 [data/cases.json](data/cases.json) 后发送 PR。

每条收录需要：

- 具体调查对象与问题；避免仅介绍工具或转发热度。
- 作者、原帖语言、原始来源链接和来源核对日期。
- 作者实际描述的步骤、结果与证据范围。缺失的细节写明，不补写成既成事实。
- 中文和英文摘要。不要复制整个原帖，保留原始来源供读者进一步阅读。
- 如果有代码、提交、演示或测试，一并提供。

证据类型：

| 值 | 含义 |
| --- | --- |
| `code` | 存在公开实现、提交或测试链接；不表示本站独立复现 |
| `report` | 作者明确使用 REA，并报告具体实践 |
| `official` | 来自 `rea.tools` 的具体调查 |
| `related` | 相关思路，原作者未确认使用 REA，或使用其他方法 |

`language` 表示主要原始材料的语言，与网站摘要语言分开。`publishedAt` 是主要来源的日期；未提供日期时用 `null`，不要以核对日期代替。`checkedAt` 是实际核对来源的日期。

新增案例后运行：

```bash
npm run build
npm run preview
```

提交数据、源文件，以及自动生成的 `CASES.md`。`dist/` 由 GitHub Actions 构建，无需提交。截图必须注明原作者与原帖；不要把第三方软件资源、凭据或整份抓包放进仓库。

Any source language is welcome. Include a specific target, a concrete question, original sources, the reported workflow and outcome, and the limits of the available evidence. Write Chinese and English summaries, keep original-language metadata, and avoid attributing an adjacent project to REA unless its creator confirms that use. Run `npm run build` before sending a pull request.
