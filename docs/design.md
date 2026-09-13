# Jav Linker 设计文档

> 一个连接多个 Jav 看片网站的浏览器扩展。在数据库（DB）类网站展示可播放的播放链接，在播放（Player）类网站提供跳转数据库详情页的链接。

## 1. 项目概览

| 项目 | 说明 |
| ---- | ---- |
| 类型 | 浏览器扩展（Chrome / Firefox，Manifest V3） |
| 语言 | TypeScript |
| 构建 | Vite + `@crxjs/vite-plugin` |
| 目标 | 在多站点间互相添加播放链接与数据库链接，打通站点壁垒 |

### 核心概念

- **Platform（平台）**：扩展**运行在其上**的网站，负责解析页面信息并向 DOM 注入链接。
- **Provider（提供者）**：扩展要**跳转去**的数据源网站，负责根据关键信息搜索并返回结果链接。

两者均为抽象类，通过"继承 + 组合"扩展新站点。

## 2. 目录结构

```
├── manifest_chrome.json      # Chrome 扩展清单
├── manifest_firefox.json     # Firefox 扩展清单
├── vite.config.ts            # 按 mode 区分双浏览器构建配置
├── index.html
├── build_scripts/
│   ├── prebuild.ts           # 构建前清理 dist
│   └── postbuild.ts          # 构建后用 web-ext 打包 release
└── src/
    ├── content.ts            # 内容脚本入口（核心分发逻辑）
    ├── background.ts         # 后台脚本：代理 fetch / cookie / 新标签页
    ├── platforms.ts          # 平台注册表（db + player）
    ├── providers.ts          # 提供者注册表（player + db）
    ├── platforms/            # 平台实现
    │   ├── platform.ts       # 平台抽象基类
    │   ├── db/               # 数据库类平台（javbus/javlibrary/javdb）
    │   └── player/           # 播放类平台（jable/123av/mf2607）
    ├── providers/            # 提供者实现
    │   ├── provider.ts       # 提供者抽象基类
    │   ├── db/               # 数据库类提供者（javdb）
    │   └── video/            # 视频类提供者
    ├── models/               # 领域模型
    ├── tools/                # 基础设施工具（网络/存储/设置等）
    ├── css/                  # 注入样式
    └── popup/                # 弹出设置页
```

## 3. 运行时架构

扩展由三个相互协作的脚本构成，通过 **消息通信（runtime messaging）** 协同：

```
┌──────────────── content script ────────────────┐
│  content.ts ──▶ 匹配 Platform ──▶ execute()     │
│      │ getInfo() 解析页面关键信息                 │
│      │ applyPlugin() 注入链接 DOM                │
│      └──── 每个按钮调用对应 Provider.search()     │
└────────────────────────┬───────────────────────┘
                         │ sendMessage
┌────────────────────────▼───────────────────────┐
│              background.ts（service_worker）     │
│   case "fetch"       代理跨域网络请求             │
│   case "getCookie"   读取 Cookie                 │
│   case "newTab"      新建标签页                   │
│  + tools/requerst_modifier.ts 修改请求头 Cookie  │
└────────────────────────┬───────────────────────┘
                         │
┌────────────────────────▼───────────────────────┐
│            popup/settings.html（设置页）         │
│   tools/setting.ts + storage.ts 读写配置        │
└───────────────────────────────────────────────┘
```

内容脚本在匹配的站点内注入 DOM，由于 MV3 中内容脚本受跨域限制，网络请求统一委托给后台脚本的 `fetch` 消息执行。

## 4. 核心领域模型

位于 `src/models/`：

### Result（结果封装）— `result.ts`
所有异步操作的统一结果类型（代数数据类型风格）：

```ts
Result<T>            // 抽象基类
├── Ok<T>            // 成功，携带 data
├── Error<T>         // 一般失败，携带 message（如"该平台找不到 xxx"）
└── ImportantError<T>// 重要失败，携带 message（平台渲染为红色错误态）
```

### NetworkResult（网络结果）— `network_result.ts`
继承自 `Result` 并附加 HTTP 状态码，用于区分底层网络错误与业务错误。

### Info（搜索输入）— `info.ts`
`{ id?, name?, type? }`，`type` 为 `PlatformType`（`Video` / `Actor`），由平台在 `getInfo()` 时填充，作为搜索提供者的输入。

### SearchData / SearchItem — `search_data.ts` / `search_item.ts`
搜索结果，`SearchData { items: SearchItem[] }`，其中 `SearchItem { name, url }` 为可跳转的候选链接。

## 5. 核心抽象

### Platform（`platforms/platform.ts`）

```ts
abstract class Platform {
  abstract name: string
  useNewTab: boolean            // 是否强制新标签打开（读自设置）
  abstract match(): boolean     // 当前页面是否属于本平台
  abstract getInfo(): boolean   // 解析页面，填充 info，失败返回 false
  abstract applyPlugin(): void  // 注入链接按钮
  execute(): void               // 入口：getInfo() 通过后执行 applyPlugin()
  handleApplyPluginResult(...)  // 统一渲染搜索结果按钮状态/弹窗/提示
}
```

**入口 `execute()`**：`getInfo()` 失败则抛 `ImportantError`，成功则 `applyPlugin()`。

**`handleApplyPluginResult`** 是公共渲染逻辑，按 `Result` 类型分发：
- `Ok`：1 个结果 → 设为普通链接；2+ 结果 → 点击弹出选择对话框（`showSelectionDialog`）
- `Error` / `ImportantError`：按钮标红并挂载 tooltip 显示错误信息

### Provider（`providers/provider.ts`）

```ts
abstract class Provider {
  abstract name: string
  abstract enable: boolean
  abstract search(info: Info): Promise<Result<SearchData>>
  async fetch(url, data?)      // 经 Network 代理，失败封装为 NetworkError
}
```

`fetch` 内建错误捕获，把网络异常统一转为 `NetworkError`，业务代码只需处理 `Result`。

## 6. 注册表与组合模式

### 平台注册表 — `platforms.ts`

```ts
dbPlatforms:    [JavBus, JavLibrary, JavDb]        // 数据库类站点
playerPlatforms:[Jable, P123av, Mf2607]            // 播放类站点
```

### 提供者注册表 — `providers.ts`

```ts
playerProviders: [Jable, P123av, JapanHub, JavHdPorn, Njav, SupJav, Mf2607]
                 .filter(p => p.enable)            // 可动态禁用
dbProviders:     [JavdbProvider]
```

### 内容脚本分发 — `content.ts`

```ts
const p = dbPlatforms.find(it => it.match())
if (p) p.execute()
else {
  p = playerPlatforms.find(it => it.match())
  if (p) p.execute()
}
```

**数据库类平台**（如 JavBus）页面展示的是影片信息，因此在页面上为每个 `playerProvider` 生成"播放链接"按钮，跳转去播放站。

**播放类平台**（如 Jable）页面是视频，因此反向注入"跳转数据库详情"的链接（如 JavDB）。

### 组合模式示例

平台与提供者内部都允许"委托组合"：

- **Jable 平台**（`platforms/player/jable.ts`）根据页面类型委托给 `JableVideo` 或 `JableActor` 子实现。
- **JavdbProvider**（`providers/db/javdb_provider.ts`）根据 `info.type` 委托给 `JavdbVideoProvider` 或 `JavdbActorProvider`。

这使每种子页面逻辑隔离，主类仅做路由。

## 7. 基础设施工具（`src/tools/`）

| 工具 | 职责 |
| ---- | ---- |
| `browser_init.ts` | 根据 UA 选择 `chrome` 或 Firefox `browser` 全局对象，抹平双浏览器 API 差异 |
| `network.ts` | 封装 `runtime.sendMessage("fetch")` 到后台，返回 `NetworkResult` |
| `storage.ts` | 封装 `browser.storage.local` 读写，返回 `Result` |
| `setting.ts` | 提供 `useNewTab` / `openInBackend` 两个设置的读写 |
| `tabs.ts` | 经后台消息新建标签页，受 `openInBackend` 设置控制是否后台打开 |
| `cookies.ts` | 经后台消息读取指定站点 Cookie |
| `requerst_modifier.ts` | 后台专用：用 `declarativeNetRequest` 拦截并改写 SupJav / Njav 请求头中的 Cookie，绕过反爬/保持登录态 |

## 8. 设置页（popup）

`popup/settings.html` + `setting_page.ts` 提供两个复选框：

- **强制使用插件打开标签页**（`useNewTab`）：平台按钮强制经 `Tabs.newTab()` 新标签打开。
- **从后台打开**（`openInBackend`）：依赖前者，新标签在后台静默打开（`active: false`）。

设置保存在 `chrome.storage.local`，通过 `Setting` 工具读写。

## 9. 后台脚本（`background.ts`）

MV3 service worker，监听消息并分发：

- `fetch`：代理跨域请求，返回 `{ status, text }`
- `getCookie`：读取 Cookie
- `newTab`：创建新标签页

同时导入 `requerst_modifier.ts`，在后台注册 `webRequest.onBeforeSendHeaders` 监听，当主页面请求触发时用 `declarativeNetRequest` 动态规则改写目标站点请求头 Cookie 并持久化到 storage。

## 10. 构建与多浏览器

- `vite.config.ts` 通过 `mode`（`chrome` / `firefox`）选择对应 manifest 并输出到 `dist_chrome` / `dist_firefox`。
- `@crxjs/vite-plugin` 将 TS 入口（content/background/popup）编译打包。
- `build_scripts/prebuild.ts`：构建前按目标清理 dist。
- `build_scripts/postbuild.ts`：构建后用 `web-ext build` 产出 `release/chrome`、`release/firefox` 安装包。

关键脚本：

```bash
npm run dev:chrome     # 开发（热更新，端口 5173）
npm run dev:firefox    # 开发（端口 5174）
npm run build          # 分别构建 chrome + firefox 并打包 release
```

## 11. 支持的站点矩阵

| 站点 | 类型 | 作为平台 | 作为提供者 |
| ---- | ---- | :------: | :--------: |
| javbus.com / seejav.me | DB | ✅ | — |
| javlibrary.com | DB | ✅ | — |
| javdb.com | DB | ✅ | ✅（详情跳转） |
| jable.tv | Player | ✅ | ✅ |
| 123av.com | Player | ✅ | ✅ |
| mf2607.com | Player | ✅ | ✅ |
| japanhub.net | Player | — | ✅ |
| javhdporn.net | Player | — | ✅ |
| njav.com | Player | — | ✅（含 Cookie 改写） |
| supjav.com | Player | — | ✅（含 Cookie 改写） |
| y78k.com | Player | — | ✅（manifest 已匹配） |

> 说明：manifest 中 `content_scripts.matches` 声明了平台匹配的站点；提供者是否出现在某个 DB 平台上由 `providers.ts` 注册表控制。上表以当前源码注册为准。

## 12. 扩展新站点指南

**新增一个"播放提供者"（最常见场景）：**
1. 在 `src/providers/video/` 新建 `XxxProvider.ts`，继承 `Provider`，实现 `search(info)` 抓取 `info.id` 对应播放页链接。
2. 在 `src/providers.ts` 的 `playerProviders` 数组中注册（受 `enable` 过滤）。
3. 若该站需要携带登录 Cookie，仿照 `requerst_modifier.ts` 增加一条 `ModifyItem` 并注册 `webRequest` 监听。

**新增一个"平台"（在其上显示链接的站点）：**
1. 在 `src/platforms/db|player/` 新建 `Xxx.ts`，继承 `Platform`，实现 `match` / `getInfo` / `applyPlugin`。
2. 在 `src/platforms.ts` 的 `dbPlatforms` / `playerPlatforms` 注册。
3. 在 `manifest_chrome.json` / `manifest_firefox.json` 的 `content_scripts.matches` 加入该站 URL 匹配。