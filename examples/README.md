# Examples

`jobs/multi-world-editorial.demo.json` 不依赖私人媒体，可以直接用于打开 Studio、生成预览和渲染无人物 demo。

制作自己的任务时：

1. 复制 demo JSON 到仓库外或 Git 忽略目录；
2. 添加 `inputVideo`，路径相对于任务单文件；
3. 可选添加 `subtitles` 指向 SRT；
4. 先运行 `pnpm job:prepare -- --job <路径>`；
5. 通过预览后再渲染。
