# Agent 兼容方式

| 工具 | 入口 | 说明 |
|---|---|---|
| Codex / 通用 Harness | `AGENTS.md` | 原生读取仓库约束，再启用 Skill |
| Claude Code | `CLAUDE.md` | 只做薄适配，实际协议仍在 `agent/PROTOCOL.md` |
| DeepSeek Harness | `agent/PROTOCOL.md` | 读取协议和任务单 Schema，调用同一组命令 |
| 其他 Agent | `README.md` | 只要能读文件和运行命令即可 |

兼容性来自稳定的文件协议和命令，不来自针对每个模型复制一份提示词。
