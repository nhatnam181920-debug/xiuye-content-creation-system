# 模型中立执行协议

## 输入

一个剪辑任务至少需要：

- 已粗剪口播视频，或允许使用无人物演示模式；
- 经过确认的核心表达；
- `schemas/video-job.schema.json` 格式的任务单；
- 可选 SRT 字幕；
- 对素材授权范围的说明。

## 四阶段状态机

### 1. prepare

验证任务单，把输入媒体复制到 Git 忽略的 `public/runtime/`，把字幕解析为帧级数据，输出 `.runtime/job.json`。不得改写用户源文件。

### 2. preview

每个场景至少导出一张中间帧。检查：文字溢出、人物是否位于圆框中心、字幕遮挡、画幅、颜色对比、风格连续性。

### 3. render

先渲染静音画面，再从源视频封装原始口播音轨。需要独立素材时，同时按场景导出 muted clips。

### 4. verify

使用 FFprobe 检查分辨率、帧率、编码、时长与音轨，再使用 FFmpeg 做完整解码检查。结果写入 `outputs/verification.json`。

## 状态标签

- `planned`：只有设计或路线图。
- `prepared`：输入与任务单已验证。
- `previewed`：预览已生成，尚未证明整片有效。
- `rendered`：文件存在，尚未通过完整验收。
- `verified`：规格和解码均通过。
- `blocked`：缺少输入、依赖或人工判断。

Agent 对外汇报时必须使用真实状态，不得把 `previewed` 写成 `verified`。

## 建议命令

```bash
pnpm doctor
pnpm job:prepare -- --job path/to/job.json
pnpm preview
pnpm render -- --clips
pnpm verify
```

## 人工闸门

以下动作必须停下并请求用户确认：

- 删除被判断为口误、重复或“废话”的语义片段；
- 使用授权不明确的音乐、字体、图片或视频；
- 改变口播原意；
- 登录、上传、定时或正式发布。
