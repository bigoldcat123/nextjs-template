<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
use bun as dependency manager


please check out `docs/ARCHITECTURE.md` and `README.md`

## 测试规范和验收标准
主要是对service的测试。
- 只编写业务逻辑（业务代码、数据处理、状态管理等）相关的单元测试/集成测试。
- 不编写 UI 层测试（组件渲染、交互、样式等），UI 部分由用户手动测试。
- 使用 Bun 自带的测试框架（`bun:test`）编写测试，通过 `bun test` 命令运行。
- 测试文件放到tests中，命名为 `<文件名>.test.ts`（或 `.test.tsx`）。
- 编写测试后需自行运行 `bun test` 并确保通过，保证业务逻辑测试的正确性和可靠性。
