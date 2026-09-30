import type { FontConfig, ResolvedFontOptions } from "../types/fontConfig.ts";
import { withUserConfig } from "../utils/config-overlay.ts";
import { resolveFontOptions as resolve } from "../utils/font-options.ts";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Shirone 全站字体配置指南
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 博客的字体分为 4 种角色（Role），每个角色各司其职：
 *  1. `body`：西文与默认基础正文字体（英文字母、数字、基础标点）
 *  2. `cjk` ：中日韩字体（汉字、日文平假名/片假名、韩文）
 *  3. `mono`：等宽代码字体（文章代码块、行内代码、终端输出）
 *  4. `ui`  ：界面字体（顶栏、侧栏、类别栏、浮动控件、按钮与表单控件）
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 【本站取值】对齐桌面端 Obsidian 的外观配置（只看字体栈部分）
 * ─────────────────────────────────────────────────────────────────────────────
 *  - 正文 `body`   = 霞鹜文楷 LXGW WenKai（Light/Regular/Medium 里的 400 + 500）
 *  - 代码 `mono`   = JetBrains Mono
 *  - 界面 `ui`     = MiSans
 *  - 中文 `cjk`    = 留空，理由见下
 *
 * Obsidian 的 `textFontFamily` 是**单一字体通吃全部正文字符**（西文与汉字同源），
 * 所以这里也把 `body` 直接指向文楷，而不是"西文一种、汉字另一种"的两段栈。
 * `cjk` 角色因此留空：正文已由文楷覆盖全部汉字，再声明一个 cjk 字体族只会让同
 * 一份字形在产物里被打包两次——Astro Fonts 按角色的 `cssVariable` 生成文件 URL，
 * 同一个物理文件挂到两个角色下会得到两个不同 URL。将来若要中英分家（如中文换
 * 更纱黑体），补一个 `role: "cjk"` 条目即可，`--m3e-font-sans` 的回退链已经就位。
 *
 * 字重说明：霞鹜文楷官方只有 Light/Regular/Medium，**没有 Bold**，汉字加粗由
 * 浏览器合成；Medium(500) 让"取真字重"成为可能，与 Obsidian 侧的表现一致。
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 【常见修改场景】
 * ─────────────────────────────────────────────────────────────────────────────
 * 场景 A：完全使用系统默认字体（零字体打包，极速加载，最省流量）
 *   - 将 `mode` 设置为 `"system"`，并将 `fontFamilies` 设为空数组 `[]`。
 *
 * 场景 B：更换本地中文字体或英文字体
 *   1. 准备你的字体文件（`.ttf`/`.otf`/`.woff2`），放入项目 `src/assets/fonts/`；
 *   2. 找到对应角色的配置（如 `role: "cjk"` 或 `role: "body"`）；
 *   3. 设置 `source: "local"`，`file` 填字体路径；
 *   4. 将 `family` 设为该字体的真实族名称。
 *
 * 场景 C：使用 npm 的 Fontsource 字体包
 *   1. 安装字体包（如 `pnpm.cmd add @fontsource/inter`）；
 *   2. 设置 `source: "fontsource"`，`file` 填对应 CSS 路径（如 `"@fontsource/inter/400.css"`）；
 *   3. 将 `family` 设为对应的字体名称（如 `"Inter"`）。
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 【修改后的验证命令】
 *   在终端依次执行：
 *   1. `npx.cmd astro check`  -> 校验配置与页面语法
 *   2. `pnpm.cmd build`        -> 执行生产构建与字体打包
 *   3. `pnpm.cmd fonts:check`  -> 校验字体格式与体积预算
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const fontConfig: FontConfig = withUserConfig("font", {
	/**
	 * 构建模式：
	 * - `"custom"`: 启用自定义字体（加载下方 fontFamilies 中配置的字体）
	 * - `"system"`: 纯系统字体模式（不打包任何自定义字体文件，完全依赖访客设备）
	 */
	mode: "custom",

	/**
	 * 字体清单列表（按需配置 body、cjk、mono、ui 角色）
	 */
	fontFamilies: [
		// ---------------------------------------------------------------------
		// 1. 正文字体：霞鹜文楷 LXGW WenKai（西文 + 汉字同源）
		//    构建期按站点字符集子集化，生产站点只交付裁剪后的 WOFF2。
		// ---------------------------------------------------------------------
		{
			id: "lxgw-wenkai-body",
			family: "LXGW WenKai",
			role: "body",
			source: "local",
			variants: [
				{
					file: "src/assets/fonts/LXGWWenKai-Regular.ttf",
					weight: 400,
					style: "normal",
				},
				{
					file: "src/assets/fonts/LXGWWenKai-Medium.ttf",
					weight: 500,
					style: "normal",
				},
			],
			fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
			display: "swap",
			preload: false,
		},

		// ---------------------------------------------------------------------
		// 2. 代码等宽字体（渲染代码块与终端文本，对应 CSS 变量 --font-mono）
		// ---------------------------------------------------------------------
		{
			id: "jetbrains-mono",
			family: "JetBrains Mono",
			role: "mono",
			source: "fontsource",
			variants: [
				{
					file: "@fontsource-variable/jetbrains-mono/index.css",
					weight: "100 800",
					style: "normal",
				},
				{
					file: "@fontsource-variable/jetbrains-mono/wght-italic.css",
					weight: "100 800",
					style: "italic",
				},
			],
			fallback: [
				"ui-monospace",
				"SFMono-Regular",
				"Menlo",
				"Monaco",
				"Consolas",
				"monospace",
			],
			display: "swap",
			preload: false,
		},

		// ---------------------------------------------------------------------
		// 3. 界面字体：MiSans（顶栏、侧栏、类别栏、按钮与表单控件等 UI 文字，
		//    对应 CSS 变量 --font-ui / --m3e-font-ui）
		// ---------------------------------------------------------------------
		{
			id: "misans-ui",
			family: "MiSans",
			role: "ui",
			source: "local",
			variants: [
				{
					file: "src/assets/fonts/MiSans-Regular.otf",
					weight: 400,
					style: "normal",
				},
				{
					file: "src/assets/fonts/MiSans-Medium.otf",
					weight: 500,
					style: "normal",
				},
			],
			fallback: ["system-ui", "Segoe UI", "Noto Sans SC", "sans-serif"],
			display: "swap",
			preload: false,
		},
	],

	/**
	 * 字体子集化配置（生产构建时自动从文章、i18n、配置及 Meting 歌曲中提取字符，生成极速精简版 .woff2）
	 * - Dev 开发环境：自动加载完整原字体，任意输入新汉字实时可见，极速 HMR 零等待；
	 * - Build 生产构建：自动执行子集裁剪，将几十兆大字体压缩为几百 KB 的专属子集，秒开加载。
	 */
	subsetting: {
		enable: true, // 启用自动化子集裁剪
		includeContent: true, // 扫描 src/content/ 下所有文章
		includeI18n: true, // 扫描全部 10 种语言词典
		includeConfig: true, // 扫描站点配置与导航
		includeCommon: true, // 包含常用标点与基础字符
		allowRemoteText: true, // 允许抓取 Meting 云端歌单曲目文本参与字形提取
	},

	/**
	 * 字体打包体积预算限制（子集化后通常仅 300KB ~ 1MB）
	 */
	budget: {
		maxTotalBytes: 6 * 1024 * 1024, // 全站引用自定义字体总大小上限：6MB
		maxFamilyBytes: 4 * 1024 * 1024, // 单个字体族文件大小上限：4MB
	},
});

/** 经过校验与标准化处理后的字体配置对象，由 Astro 模板与 CSS 消费 */
export const resolvedFontOptions: ResolvedFontOptions = resolve(fontConfig);

/** 字体配置解析与校验函数 */
export const resolveFontOptions: (config: FontConfig) => ResolvedFontOptions =
	resolve;
