/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "home-network",
		title: "家庭网络基建",
		summary:
			"从零构建的宿舍内网：路径 MTU 修复、入站暴露面审计与三通道远程访问体系。",
		category: "network",
		phase: "building",
		technologies: ["OpenWrt", "nftables", "TCP/IP", "Tailscale", "frp"],
		icon: "material-symbols:router-rounded",
		featured: true,
		year: "2026",
	},
	{
		key: "nfwc-server",
		title: "脆骨症：黯光服务器",
		summary:
			"自建的 Minecraft 整合包服务器，含 JVM 调优、区块预生成、健康探针与异地备份体系。",
		category: "selfhosted",
		phase: "shipped",
		technologies: ["Linux", "Forge", "systemd", "RCON", "JVM"],
		icon: "material-symbols:sports-esports-outline-rounded",
		featured: true,
		year: "2026",
	},
	{
		key: "homelab",
		title: "家庭实验室自托管栈",
		summary:
			"以瘦客户端为主机的 24 小时自托管平台，承载文件共享、知识库与自动化服务。",
		category: "selfhosted",
		phase: "shipped",
		technologies: ["Debian", "Samba", "mergerfs", "Syncthing", "systemd"],
		icon: "material-symbols:home-storage-rounded",
		year: "2026",
	},
	{
		key: "aetheris-blog",
		title: "Aetheris 博客与内容流水线",
		summary:
			"从 Obsidian 笔记到线上站点的自动化发布链路，含双仓 CI、内容校验门禁与外观工程。",
		category: "content",
		phase: "building",
		technologies: ["Astro", "Cloudflare Pages", "GitHub Actions", "Syncthing"],
		icon: "material-symbols:article-outline-rounded",
		website: "https://blog.jiuxinya.xyz",
		year: "2026",
	},
	{
		key: "exposure-audit",
		title: "入站暴露面审计与加固",
		summary:
			"对家庭内网做全量入站暴露面审计，识别 10 项风险并完成 8 项加固，内网可用性零损失。",
		category: "security",
		phase: "shipped",
		technologies: ["nftables", "Samba", "SSH", "OpenWrt", "安全审计"],
		icon: "material-symbols:shield-lock-outline-rounded",
		year: "2026",
	},
];

/** 获取所有项目数据列表 */
export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
