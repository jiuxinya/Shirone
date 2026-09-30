import type { ProjectsConfig } from "@/types/projectsConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 项目页行为与展示配置。
 *
 * 遵循「配置管行为，数据管内容」原则：
 * - enable：页面总开关；false 时导航入口同步隐藏，访问 /projects/ 跳转 404；
 * - categories：筛选分类清单（数组顺序即页面顶部 Chips 顺序）；
 * - disabledKeys：可选被禁用的项目 key 列表（例如 ["folkpatch"]）；
 *
 * 注：项目的具体内容数据（标题、描述、技术栈、链接、封面等）请在 `src/data/projects.ts` 中维护。
 */
export const projectsConfig: ProjectsConfig = withUserConfig("projects", {
	enable: true,
	title: "$t:projects",
	description:
		"从零搭建并持续维护的工程实践，覆盖网络基建、自托管服务与安全加固。",
	categories: [
		{
			key: "network",
			label: "网络与基础设施",
			icon: "material-symbols:lan-rounded",
		},
		{
			key: "selfhosted",
			label: "自托管与运维",
			icon: "material-symbols:home-storage-rounded",
		},
		{
			key: "content",
			label: "内容与工具链",
			icon: "material-symbols:article-outline-rounded",
		},
		{
			key: "security",
			label: "安全与加固",
			icon: "material-symbols:shield-lock-outline-rounded",
		},
	],
	// disabledKeys: [],
});
