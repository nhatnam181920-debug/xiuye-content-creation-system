# 秀野内容创作系统

一个面向知识类口播视频的、Agent 友好的本地内容制作仓库。总仓库名为「秀野内容创作系统」，当前首个成熟能力分支是「秀野内容创作系统—动画」。

当前公开版本只包含已经跑通过真实成片的第一项能力：**把已粗剪的口播视频，编排成带人物画面、知识动画、字幕和多视觉世界的 16:9 成片，并同时导出独立动画片段。**

选题调研、写稿、自动粗剪、封面和多平台发布仍在路线图中

## 当前能做什么

- 接收一条已经粗剪好的口播视频，以及可选的 SRT 字幕。
- 读取一个 JSON 任务单，生成 1920×1080、30fps 的 Remotion 成片。
- 在米白编辑部、学术蓝、实践绿、商业黑金、梅子紫五种视觉世界间切换。
- 支持全屏人物、圆形居中人物框、纯动画三种镜头关系。
- 支持钩子、卡片、流程、关系网络、总结五类知识表达。
- 导出整片、分场景独立片段、预览帧和机器可读的验收报告。

## 当前不能做什么

- 不会自动判断口误、语义重复或应删除的句子。
- 不会自动抓取抖音、小红书，也不会伪装成已经完成的选题系统。
- 不会操作剪映 GUI 或承诺全自动导出剪映草稿。
- 不会自动登录、上传或发布到任何社媒平台。
- 不会把一个模板试片称为“完整剪辑”。

## 快速开始

环境要求：Node.js 20+、pnpm、FFmpeg、FFprobe。首次运行需要下载 Remotion 官方 Headless Shell。

```bash
pnpm install
pnpm browser:ensure
pnpm doctor
pnpm job:prepare -- --job examples/jobs/multi-world-editorial.demo.json
pnpm preview
pnpm render
pnpm verify
```

没有真人视频也能运行示例任务单；人物区域会显示中性占位图。使用自己的视频时，复制示例任务单并填写 `inputVideo` 与可选的 `subtitles`。准备脚本只把运行副本放进被 Git 忽略的目录，不会把私人素材提交到仓库。

## 给 Agent 使用

- Codex、通用 Harness：先读 [AGENTS.md](AGENTS.md)，再按需启用 `skills/content-video-editor`。
- Claude Code：从 [CLAUDE.md](CLAUDE.md) 进入。
- 其他模型：直接执行 [统一协议](agent/PROTOCOL.md)。

Agent 不应绕过 `prepare → preview → render → verify`。预览通过之前，不应直接声称已经交付成片。

## 仓库结构

```text
秀野内容创作系统/
├─ AGENTS.md                         # 通用 Agent 入口
├─ CLAUDE.md                         # Claude Code 薄适配
├─ agent/PROTOCOL.md                 # 模型中立执行协议
├─ modules/animation/                # 秀野内容创作系统—动画
├─ skills/content-video-editor/      # 当前唯一成熟 Skill
├─ schemas/video-job.schema.json     # 任务单契约
├─ templates/multi-world-editorial/  # 模板说明与设计约束
├─ src/                              # Remotion 渲染器
├─ scripts/                          # 准备、预览、渲染、验收
├─ examples/                         # 不含私人数据的示例
└─ docs/                             # 系统架构、兼容性、发布清单
```

## 隐私与发布边界

原视频、音频、字幕、评论数据、Cookie、Token、账号信息、私人稿件和渲染产物都在 `.gitignore` 中。提交前仍需运行 `pnpm release:check` 并人工查看 Git diff。

## 项目状态

这是 `0.1.0` 骨架版：首个模板已按真实工作流抽象，公开 demo 已完成预览、整片、5 个独立片段与完整解码验收。它仍不代表自动粗剪、封面或发布能力已经完成。五阶段系统的真实状态见 [ROADMAP.md](ROADMAP.md)。

## License

仓库原创代码采用 [MIT License](LICENSE)。用户输入素材、字体、音乐、音效与第三方依赖各自遵循其授权条款。
