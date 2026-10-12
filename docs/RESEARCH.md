# 来源核对记录

核对日期：2026-10-12。对象为 [morluto/rea](https://github.com/morluto/rea)，官方网站为 [rea.tools](https://rea.tools)。

搜索从用户提供的三条 X 原帖开始，继续追踪引用帖、作者提供的实现链接与官方具体调查。搜索覆盖中文、英文、日文；不限原帖语言。

原生 X 搜索使用 OpenCLI 的只读 `twitter search`，主要查询包括：

```text
"rea.tools" OR "morluto/rea" OR "rea-agents"
REA ("reverse engineered" OR reversed OR built OR used) lang:en -filter:nativeretweets
REA (検証 OR 解析 OR 試した) lang:ja -filter:nativeretweets
```

另用网页搜索查找索引中的 X 帖与外链；原帖正文和引用关系通过公开帖读取结果核对。X 页面无法由网页读取器访问时，使用 FxTwitter 的公开帖 JSON 读取正文、引用帖和媒体地址。二次收录站只用于发现原始链接，没有作为结果的唯一依据。

来源与摘要保存在 `data/cases.json`。不保存整篇原帖、互动数快照或个人资料。公开截图仅用于展示对应案例，署名和原帖见 `docs/images/README.md`。

关键归因判断：

- 宝玉的 CapCut、Claude Slides、Codex 注解调查均明确提到 REA。Slides 帖还提供了 baocut 实现提交。
- LinearUncle 的注解实现使用录屏与 Fable，REA 指向他引用的宝玉调查，故列为相关思路。
- jinglian 的帖子讨论 REA 的设备协议用途；他链接的 AR 移植原帖只明确写了 Codex 与 Lens Studio，没有确认 REA，故列为相关思路。
- thinkszyg 的智能马桶帖子明确写了 REA、Codex 与微信小程序蓝牙协议。
- AZERDSQ0329 的 Lemmings 帖明确写了 REA，但未提供完整代码或测试，保留为进行中的作者报告。
- 日文 Electron 实测文来自作者的实践文章；未把介绍性 X 帖冒充实测成果。

此收集核对的是公开材料及其描述，不表示独立复现所有项目。
