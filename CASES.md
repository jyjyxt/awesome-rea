# REA 应用实例 / REA investigations

来源核对日期：2026-10-12。中英文均为编辑摘要；作者报告保留原有范围，本站未独立复现。

由 `data/cases.json` 生成。请编辑数据后运行 `npm run build`。

## CapCut

**作者实践 / Author report** · @dotey · 中文

不知道模板在哪、字幕如何渲染？让助手操作 CapCut，同时观察网络请求和本地文件，找出模板下载路径。

An agent operates CapCut while observing requests and saved files to locate animated-caption assets and their download paths.

- 结果：作者报告：Codex 从逐个点击转向直接下载，最终获得 2,291 个模板。
- 范围：数量来自作者报告。原帖没有证明已复现整个字幕渲染器，也没有公开完整的独立复现测试。

- [X · @dotey](https://x.com/dotey/status/2109470081776283941)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/capcut-templates/)

## Codex / ChatGPT

**作者实践 / Author report** · @dotey · 中文

分析 Codex 内置浏览器里“标记 → 评论 → 输入框”的链路，最后找到可由网页调用的注解接口，并做了测试页。

Investigate the annotation-to-composer flow in Codex's browser, discover an existing website API, and build a test page.

- 结果：测试页能打开评论框并填充内容；作者没有做到直接把评论附加到聊天输入框。
- 范围：是接口发现与部分行为验证。不能据此推断网页可以任意写入 composer，或其他编程助手也支持相同接口。

- [X · @dotey](https://x.com/dotey/status/2109417222724600172)
- [Annotation API documentation](https://learn.chatgpt.com/docs/annotations-extensibility#open-an-annotation-from-your-website)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/codex-annotations/)

## Claude Slides

**有公开代码 / Public code** · @dotey · 中文

下载编辑器脚本和样式，交给 REA Skill 分析，再用 Claude Code 整理代码。原帖提供了实现提交。

Inspect downloaded editor scripts and styles with REA Skill, then restructure the recovered implementation with Claude Code. A code commit is linked.

- 结果：作者报告复现了几乎完整的编辑器功能，并公开 baocut 中的相关提交。
- 范围：“几乎完整”是作者描述，不是本站的功能覆盖测试。公开实现也不等于恢复了原始源码。

- [X · @dotey](https://x.com/dotey/status/2109151666020794711)
- [baocut · implementation commit](https://github.com/JimLiu/baocut/commit/b8585e0c8d7a82bdee9f0ed019cf6edb075e41c1)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/claude-slides/)

## Smart toilet / BLE

**作者实践 / Author report** · @thinkszyg · 中文

用 REA 与 Codex 分析微信小程序的蓝牙控制协议，做出原生遥控器。作者展示电脑点击与实物翻盖的录屏。

Use REA and Codex to investigate a WeChat miniprogram's Bluetooth protocol and build a native remote, with a lid-control demonstration.

- 结果：作者报告约半小时做出状态栏应用，演示了从电脑操作马桶翻盖。
- 范围：原帖没有公开协议字段、完整源码或通用设备兼容性测试。半小时是该作者的单次经验。

- [X · @thinkszyg](https://x.com/thinkszyg/status/2109309251533570509)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/toilet-ble/)

## DX-Ball 1.07

**有公开代码 / Public code** · REA / N0zoM1z0 · English

从不完整的伪代码回到 x86 指令，追踪输入与常量，把横坐标到左右声道的计算写成 C，再与原版对比。

Follow x86 instructions, caller references, and constants to reconstruct the game's position-to-pan calculation in C.

- 结果：案例给出 3,205 组原始 x86 差分测试，以及完整 63 字节函数的编译匹配。
- 范围：验证范围是这个音效函数，不是整款游戏的完整重建。需要匹配的原始目标和固定工具链。

- [REA · DX-Ball investigation](https://rea.tools/showcase/dx-ball/)
- [N0zoM1z0/dx-ball](https://github.com/N0zoM1z0/dx-ball)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/dxball-pan/)

## Notion Desktop

**官方调查 / Official investigation** · REA · English

穿过 Notion 的页面 API、preload 和主进程，追踪富文本复制链路，理解 HTML 标记如何关联本地块数据。

Trace Notion's page API through preload wrappers and main-process IPC, then examine how copied HTML references stored block data.

- 结果：找到 notion:clipboard:write 链路，以及 HTML 中的 ID 与本地块数据之间的关联。
- 范围：桌面包为 7.6.1，网页资源另有版本。模块探针结果不能等同于完整桌面 UI 会话。

- [REA · Notion clipboard](https://rea.tools/showcase/notion/)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/notion-clipboard/)

## Touhou TH04 / PC-98

**有公开代码 / Public code** · REA / N0zoM1z0 · English

检查 PC-98 游戏的角度计算，把乘除法与坐标运算整理成 C++，理解固定与瞄准弹幕的生成规则。

Inspect a PC-98 game's angle helper and connect its arithmetic to a readable C++ reconstruction of fixed and aimed bullet rings.

- 结果：官方案例展示了恢复的角度算法，并链接公开重建仓库。
- 范围：此条关注角度辅助函数；不把局部重建结论推广为整款游戏都已验证。

- [REA · TH04 investigation](https://rea.tools/showcase/th04/)
- [N0zoM1z0/th04](https://github.com/N0zoM1z0/th04)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/th04-bullets/)

## Aegis Authenticator

**官方调查 / Official investigation** · REA · English

从 Aegis 发布的 APK 追踪验证码生成方法，恢复时间步长与六位数字的关系，再用可调时钟演示。

Trace code-generation methods in an Aegis release APK and demonstrate the recovered time-step rule with an adjustable clock.

- 结果：官方案例用 APK 内的方法解释 TOTP 生成规则，并提供交互式时钟示例。
- 范围：这是已知算法与应用实现的分析，不代表能获取真实账户密钥或绕过认证。

- [REA · Aegis APK investigation](https://rea.tools/showcase/aegis/)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/aegis-totp/)

## DownUnderCTF

**官方调查 / Official investigation** · REA · English

分析一个入门 CTF 程序，找到检查函数，把掩码与求和逻辑改写成方程，再用原程序核对答案。

Find checking functions in an introductory CTF binary, translate masks and sums into equations, and verify the result with the original program.

- 结果：官方案例展示从函数分析到约束求解，并在原程序中验证得到的 flag。
- 范围：案例范围是一个特定入门挑战，不能作为任意复杂程序自动求解的证据。

- [REA · DownUnderCTF walkthrough](https://rea.tools/showcase/ctf/)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/ductf-checker/)

## Self-built Electron app

**作者实践 / Author report** · 海外Tech Radar · 日本語

日文实践文章用一个四文件 Electron 风格应用核对 REA 的模块与 IPC 分析，同时记录动态路径没被解析的情况。

A Japanese hands-on article checks REA's module and IPC findings against a four-file Electron-style app and records unresolved dynamic paths.

- 结果：作者报告识别了窗口、暴露 API 与 IPC 通道；部分字符串拼接路径没有解析出来。
- 范围：是静态 CLI 调查，作者未验证 Agent 注册、原生反编译或实际运行行为。

- [日本語 · hands-on article](https://note.com/kaigai_tech/n/n47bb7d83bc60)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/electron-static-ja/)

## Lemmings (1991)

**作者实践 / Author report** · @AZERDSQ0329 · English

英文社区进展帖明确提到使用 REA 重建 1991 年的 Lemmings，作者表示正在逐像素调整复现结果。

An English community progress post explicitly names REA in a reconstruction of the 1991 game Lemmings, with pixel-level adaptation still underway.

- 结果：作者报告已完成逆向分析，正在逐像素调整。收录为进行中的个人实践。
- 范围：这是一条短进展帖，未提供完整调查步骤、公开仓库或差分测试。不能据此认定整款游戏已验证完成。

- [X · @AZERDSQ0329](https://x.com/AZERDSQ0329/status/2109599439471923391)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/lemmings-reconstruction/)

## Air conditioner / AR

**相关思路 / Related inspiration** · @icanberk / @jinglian · English

jinglian 用这个空调案例讨论协议调查的方向。原作者展示了用 Codex 与 Lens Studio 将控制应用移植到眼镜。

jinglian cites an air-conditioner remote as protocol-investigation inspiration. Its creator shows a glasses port made with Codex and Lens Studio.

- 结果：原作者报告用不到 15 分钟完成眼镜端移植，附有视频演示。
- 范围：原作者这条移植帖没有提到 REA。作为相关思路收录，不归为已确认使用 REA 的成果。

- [X · @jinglian · REA discussion](https://x.com/jinglian/status/2109567957890429431)
- [X · @icanberk · original AR demo](https://x.com/icanberk/status/2109122304429236559)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/ac-ar-inspiration/)

## Browser annotations

**相关思路 / Related inspiration** · @LinearUncle · 中文

回应 REA 的 Codex 注解调查，提供另一条路线：录下标记、评论、发送的完整操作，让助手按可见行为实现。

In response to the REA annotation investigation, this post offers an alternative: record the interaction and have an agent reproduce the visible behavior.

- 结果：作者报告自己的 harness 已通过录屏方式复刻内置浏览器注解功能。
- 范围：作者自己的实现采用录屏方法；提到 REA 是引用宝玉的调查。Opus 的部分是作者估计，不是已验证结果。

- [X · @LinearUncle](https://x.com/LinearUncle/status/2109467895013281896)
- [X · @dotey · referenced REA investigation](https://x.com/dotey/status/2109417222724600172)

[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/annotation-recording/)
