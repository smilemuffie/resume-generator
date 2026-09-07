# 简历生成器 · Resume Generator

一个 JSON 驱动的简历生成工具：左侧 CodeMirror 编辑 JSON，右侧实时预览 A4 排版，支持自动分页、5 套模板、9 种主题色、中英双语，一键导出 [PDF](./docs/resume-demo.pdf)。纯前端实现，零后端依赖，数据全部存浏览器 localStorage。

![resume](./docs/resume-generator.png)

## 功能特性

- **JSON 实时编辑** — 左侧 CodeMirror 6 编辑器，右侧即时渲染，所见即所得
- **5 套模板** — 极简 Minimal / 纯净 Pure / 表格 Tabular / 基础 Basic / 现代 Modern
- **9 种主题色** — 每个模板独立记忆配色，切换模板不丢色
- **中英双语** — 整份简历按语言分版本，一键切换中 / EN，两版数据独立存储
- **自动分页** — 内容超出 A4 自动续页，区块标题仅在首页出现，不跨页截断
- **预览配置弹窗** — 全局勾选控制工作经历 / 项目经历技术栈 tag 显隐
- **技术栈字段** — `work` / `projects` 每项可填 `stack`，渲染为强调色 tag
- **`{{stack}}` 占位符** — projects 的 `description` 可用 `{{stack}}` 自动替换为技术栈拼接
- **编辑器工具栏** — 复制（toast 提示）/ 清空（二次确认）/ 导出 JSON
- **个人简介升级** — 摘要 + highlights 亮点列表，支持 HTML 标签渲染
- **性别 + 年龄** — 填 `birthDate` 自动按周岁换算，与邮箱/手机同排展示
- **本地持久化** — 简历数据、语言、模板、主题色、预览配置全部入 localStorage
- **PDF 导出** — 基于浏览器原生打印，保留背景色与固定 A4 边距
- **单文件构建** — `vite-plugin-singlefile` 将 JS（IIFE）+ CSS 全部内联到 `dist/index.html`，可直接 `file://` 打开

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 构建 | Vite 5 + vite-plugin-singlefile |
| 语言 | TypeScript 5 |
| 编辑器 | CodeMirror 6（@codemirror/state, view, lang-json, lint, commands） |
| 状态 | 自实现发布订阅（store.ts） |
| 存储 | localStorage |
| 导出 | 浏览器原生打印（`window.print()`） |
| 依赖 | 零运行时后端，纯静态 |

## 快速开始

### 环境要求

- Node.js ≥ 18
- npm（或 pnpm / yarn）

### 安装与启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

浏览器打开终端输出的地址（默认 `http://localhost:5173/`）。

### 构建生产版本

```bash
npm run build      # tsc 类型检查 + vite build，产物输出到 dist/index.html（单文件）
npm run preview    # 本地预览生产构建
```

构建产物为单个 `dist/index.html`（JS 内联为 IIFE、CSS 内联为 `<style>`、资源 base64），双击即可用 `file://` 协议打开，无需起服务器。

> 若需在 `file://` 下加载，构建已将 `<script>` 的 `type="module"` / `crossorigin` 属性移除，避免 ES Module CORS 限制。

## 使用指南

### 顶栏按钮

| 按钮 | 作用 |
| --- | --- |
| 模板下拉 | 切换简历模板（极简 / 纯净 / 表格 / 基础 / 现代） |
| 中 / EN | 切换简历语言，两版数据独立存储 |
| 色块 | 切换主题色，强调元素即时变色，每个模板独立记忆 |
| 齿轮 | 打开预览配置弹窗，勾选控制技术栈显隐 |
| JSON模版下载 | 下载内置完整中文 JSON 模版 |
| 导出 PDF | 调起浏览器打印，另存为 PDF |

### 编辑器工具栏

| 按钮 | 作用 |
| --- | --- |
| 复制 | 复制当前 JSON 全部内容到剪贴板，下方 toast 提示 |
| 清空 | 二次确认弹窗，确认后清空编辑器（可再下载模版恢复） |
| 导出 JSON | 下载当前编辑器内容为 `resume-data.json` |

### 导出 PDF

顶栏 `导出 PDF` 调起浏览器打印对话框：

- 目标另存为 PDF
- 纸张选 A4
- 边距选「无」（页面边距已由模板内置）
- 勾选「背景图形」以保留强调色背景

## JSON 数据结构

```jsonc
{
  "basics": {
    "name": "张三",
    "label": "前端工程师",
    "gender": "男",                       // 性别，与邮箱/手机同行展示
    "birthDate": "1995-08",               // 出生年月（YYYY-MM），自动按周岁换算为年龄
    "email": "zhangsan@example.com",
    "phone": "138-0000-0000",
    "website": "https://zhangsan.dev",
    "summary": "5 年前端开发经验……",     // 支持 HTML 标签渲染
    "highlights": [                       // 个人简介下的亮点列表（可选，支持 HTML）
      "主导中台前端架构与组件体系建设",
      "推动构建体系升级，平均构建速度提升 40%"
    ],
    "location": { "city": "上海", "region": "中国" },
    "profiles": [{ "network": "GitHub", "url": "https://github.com/zhangsan" }]
  },
  "work": [{
    "company": "某科技公司",
    "position": "高级前端工程师",          // 以 3px 倒角 tag 展示在标题右侧（加粗）
    "startDate": "2022-01",
    "endDate": "至今",
    "summary": "负责中台前端架构……",       // 支持 HTML 标签渲染
    "highlights": ["重构构建系统，构建提速 40%"],  // 支持 HTML 标签渲染
    "stack": ["React", "TypeScript", "Vite"],     // 技术栈，渲染为公司名下 tag
    "isStackShow": true                           // false 时隐藏该项技术栈
  }],
  "education": [{
    "institution": "某大学",
    "area": "计算机科学与技术",
    "studyType": "本科",
    "startDate": "2016-09",
    "endDate": "2020-06",
    "score": "3.8/4.0"
  }],
  "skills": [{
    "name": "前端",                        // 技能分组 label
    "level": "",
    "keywords": ["React", "Vue", "Vite", "TypeScript"]  // tag 形式展示（加粗）
  }],
  "projects": [{
    "name": "简历生成器",
    "description": "基于 {{stack}} 构建的中台组件库……",  // {{stack}} 会被替换；支持 HTML
    "url": "https://github.com/xx/resume-ge",
    "startDate": "2024-01",
    "endDate": "2024-06",
    "highlights": ["实现多语言编辑与 localStorage 持久化"],  // 支持 HTML 标签渲染
    "roles": ["前端负责人", "架构设计"],     // 以 3px 倒角 tag 展示在标题右侧（加粗）
    "stack": ["React", "TypeScript", "Rollup"],
    "isStackShow": true
  }],
  "certificates": [{                       // 以 tag 形式展示（加粗）
    "name": "PMP 项目管理专业人士认证",
    "issuer": "PMI",
    "date": "2023-06",
    "url": "https://www.pmi.org/certification",
    "summary": "项目管理方向"
  }],
  "awards": [{ "title": "年度最佳员工", "date": "2023-12", "awarder": "某科技公司", "summary": "……" }],
  "languages": [{ "language": "中文", "fluency": "母语" }],
  "interests": ["开源", "Vite 插件", "工具链", "阅读", "长跑"]  // 字符串数组，以 tag 形式展示
}
```

### 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `basics.birthDate` | `string` | `YYYY-MM` 格式，经 `calcAge()` 换算周岁，`ageLabel()` 本地化展示 |
| `work.stack` / `projects.stack` | `string[]` | 技术栈，渲染为公司名 / 项目名下强调色 tag |
| `work.isStackShow` / `projects.isStackShow` | `boolean` | `false` 隐藏该项技术栈；缺省或 `true` 显示 |
| `projects.description` 的 `{{stack}}` | 占位符 | 渲染时替换为该项目的 `stack` 以 ` + ` 连接；stack 为空则清除 |
| `interests` | `string[]` | 字符串数组，以 tag 形式展示 |

### 支持 HTML 渲染的字段

以下字段可直接写入 HTML 标签（如 `<b>`、`<strong>`、`<a>`），渲染走 `innerHTML`；其他字段（姓名、公司名）走 `esc()` 转义，避免 XSS。

- `basics.summary`、`basics.highlights[]`
- `work.summary`、`work.highlights[]`
- `projects.description`、`projects.highlights[]`

完整模版可点击顶栏 `JSON模版下载` 获取，源为 [sample-resume.ts](src/sample-resume.ts) 的 `zh` 版本。

## 模板

5 套模板，顶栏下拉切换，样式与主题色独立记忆。

| 模板 | ID | 风格 |
| --- | --- | --- |
| 极简 Minimal | `minimal` | 单栏无衬线，大留白，细点分隔（默认） |
| 纯净 Pure | `pure` | 以极简为蓝本，highlights 以 1. 2. 3. 数字编号呈现 |
| 表格 Tabular | `tabular` | 工作经历以 2 列表格展示，左公司右摘要，虚线分隔 |
| 基础 Basic | `basic` | 单栏衬线，传统专业风，微软雅黑，内容缩进 18px |
| 现代 Modern | `modern` | 左侧浅色侧边栏 + 右侧主体 |

## 预览配置

顶栏齿轮按钮打开配置弹窗，状态持久化到 `localStorage` 键 `resume-ge:cfg`。

| 配置项 | 默认 | 作用 |
| --- | --- | --- |
| 展示工作经历技术栈 | `true` | 取消勾选则所有工作经历下方技术栈 tag 隐藏 |
| 展示项目经历技术栈 | `true` | 取消勾选则所有项目经历下方技术栈 tag 隐藏 |

实现：[renderer.ts](src/render/renderer.ts) 的 `draw()` 读取 `getConfig()`，取消勾选时强制将对应区块 `isStackShow` 置 `false` 再渲染；配置变化通过 `subscribeConfig(draw)` 即时重绘。

## 项目结构

```
resume-ge/
├── index.html                  # 入口 HTML（顶栏 / 编辑器 / 预览 / 弹窗 / toast）
├── package.json
├── vite.config.ts             # 单文件构建（vite-plugin-singlefile）
├── tsconfig.json
├── docs/                       # 使用说明 readme.html + 示例 PDF / 截图
└── src/
    ├── main.ts                 # 应用入口：装配编辑器 / 渲染器 / UI 交互
    ├── types.ts                # 数据类型（Basics / Work / Project / Resume / ResumeDoc）
    ├── store.ts                # 发布订阅状态机（doc / lang / template / colors）
    ├── storage.ts              # localStorage 读写 + 老数据 normalize
    ├── theme.ts                # 9 色调色盘 + 各模板默认色 + getThemePair
    ├── config.ts               # 预览配置（showWorkStack / showProjectStack）+ 订阅
    ├── sample-resume.ts        # 内置示例（中英双语，模版下载源）
    ├── editor/
    │   └── json-editor.ts      # CodeMirror 6 编辑器
    ├── export/
    │   └── print.ts            # PDF 导出（window.print 封装）
    ├── render/
    │   ├── renderer.ts         # 渲染器（订阅状态 → 模板渲染 → 分页 → 主题色注入）
    │   ├── paginate.ts         # 自动分页（顶层块切分 A4，过高 section 按子项拆分）
    │   └── templates/
    │       ├── minimal.ts      # 极简模板
    │       ├── pure.ts         # 纯净模板（数字编号列表）
    │       ├── tabular.ts      # 表格模板
    │       ├── basic.ts        # 基础模板
    │       ├── modern.ts       # 现代模板（侧边栏布局）
    │       └── util.ts         # 公共工具（esc / chip / icon / listItems / resolveDescription / calcAge）
    └── styles/
        ├── app.css             # 应用 UI（工具栏 / 编辑器 / 预览 / 弹窗 / toast）
        ├── templates.css       # 模板样式（设计令牌 + 各模板 scoped 类 + tag + chips）
        └── print.css           # 打印样式（@page A4 + 分页控制 + print-color-adjust）
```

## 架构说明

### 数据流

```
JSON 编辑器 ──setResumeAt()──▶ store ──notify()──▶ renderer.draw()
                                                  │
                                                  ▼
                                  模板渲染 HTML → paginate() → 分页 DOM
                                                  │
                                                  ▼
                                       注入主题色 CSS 变量
```

- **store.ts**：极简发布订阅，内存态 `AppState`，每次 `set*` 写 localStorage 并 `notify()`。
- **renderer.ts**：`subscribe(draw)` + `subscribeConfig(draw)`，状态或配置变化即时重绘。
- **paginate.ts**：测量 DOM 高度，按 A4 页高切分，区块标题仅在首页出现，过高 section 按子项拆分，避免跨页截断。

### localStorage 键

| 键 | 内容 |
| --- | --- |
| `resume-ge:doc` | 中英两份完整简历（ResumeDoc） |
| `resume-ge:lang` | 当前编辑语言（`zh` / `en`） |
| `resume-ge:template` | 当前模板 ID |
| `resume-ge:colors` | 各模板绑定的主题色 accent |
| `resume-ge:cfg` | 预览配置（showWorkStack / showProjectStack） |

### 渲染约定

- **设计令牌**：每套模板根节点 `.tpl-xxx` 定义 `--accent` / `--accent-soft` / `--bg-soft`，renderer 在渲染后按 `getThemePair()` 覆盖 CSS 变量。
- **tag / chip**：技能关键词、兴趣、证书统一用 `chip(text, variant)`（`accent` 强调色描边淡底 / `plain` 灰描边），职位 / 角色 / 技术栈 tag 一律 3px 倒角、`font-weight: 600`。
- **HTML 渲染白名单**：`basics.summary`、`basics.highlights[]`、`work.summary`、`work.highlights[]`、`projects.description`、`projects.highlights[]` 走 `innerHTML`；其余字段走 `esc()` 转义。
- **`{{stack}}` 替换**：`util.ts` 的 `resolveDescription(description, stack)` 在含占位符时替换为 `stack.join(' + ')`，stack 为空则清除占位符，仅作用于 projects 的 description。
- **年龄**：`util.ts` 的 `calcAge(birthDate)` 按周岁计算，`ageLabel(birthDate, lang)` 本地化（zh: `35 岁` / en: `35 yrs`）。

## 开发说明

- **新增模板**：在 `src/render/templates/` 新建 `xxx.ts` 导出 `render(r, lang)`，在 [types.ts](src/types.ts) 的 `TemplateId` 加 ID，在 [storage.ts](src/storage.ts) 的 `VALID_TEMPLATES` / `loadColors` 加键，在 [renderer.ts](src/render/renderer.ts) 的 `TEMPLATES` 注册，在 [theme.ts](src/theme.ts) 的 `DEFAULT_COLORS` 加默认色，在 [index.html](index.html) 下拉加选项，在 [templates.css](src/styles/templates.css) 加 `.tpl-xxx` 作用域样式。
- **修改模板渲染**：编辑 `src/render/templates/<name>.ts`。
- **修改样式**：[templates.css](src/styles/templates.css)（模板）/ [app.css](src/styles/app.css)（应用 UI）。
- **修改分页行为**：[paginate.ts](src/render/paginate.ts)。
- **修改打印样式**：[print.css](src/styles/print.css)。
- **新增主题色**：[theme.ts](src/theme.ts) 的 `THEME_COLORS` 数组加 `{ name, accent, soft }`。
- **修改示例数据 / 模版下载内容**：[sample-resume.ts](src/sample-resume.ts)。
- **预览配置**：[config.ts](src/config.ts)（状态 + 订阅），弹窗 UI 在 [index.html](index.html) 的 `#settings-modal`，交互在 [main.ts](src/main.ts)。

## License

MIT
