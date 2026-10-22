# 秀野内容创作系统—动画

当前仓库首个经过验证的能力分支。

## 能力入口

- Agent Skill：`../../skills/content-video-editor/SKILL.md`
- 任务单 Schema：`../../schemas/video-job.schema.json`
- 首个模板：`../../templates/multi-world-editorial/README.md`
- 执行协议：`../../agent/PROTOCOL.md`

## 当前边界

接收已经粗剪的口播视频和可选 SRT，负责编排人物、知识动画与字幕，导出整片、独立素材、预览和验收报告。它暂不声称能够理解并删除语义口误、自动加入有授权的音乐音效，或发布到社媒平台。

## 验证状态

公开 demo 已验证：1920×1080、30fps、H.264、840 帧；整片和 5 个独立片段均可完整解码。
