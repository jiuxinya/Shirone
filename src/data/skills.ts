/**
 * 技能页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/skillsConfig.ts 控制。
 *
 * 等级只用 advanced / intermediate / beginner 三档，不使用 expert：
 * 每一项都要求能在项目页或文章里找到支撑证据。
 */
import type { SkillItem } from "@/types/skillsConfig";

export const skillsData: SkillItem[] = [
	{
		name: "Linux 系统运维",
		description: "Debian 13 与 Arch Linux 的部署、服务管理与故障排查。",
		icon: "simple-icons:linux",
		category: "systems",
		level: "advanced",
	},
	{
		name: "TCP/IP 排障与拥塞控制",
		description: "路径 MTU、拥塞控制算法与丢包归因的实测排查。",
		icon: "material-symbols:swap-horiz",
		category: "systems",
		level: "intermediate",
	},
	{
		name: "nftables 与 iptables 防火墙",
		description: "以独立表实现来源白名单与设备级拦截。",
		icon: "material-symbols:shield",
		category: "systems",
		level: "intermediate",
	},
	{
		name: "OpenWrt 与软路由",
		description: "网关设备的分区策略、DNS 解析与区域防火墙配置。",
		icon: "simple-icons:openwrt",
		category: "systems",
		level: "intermediate",
	},
	{
		name: "Samba 与文件共享",
		description: "共享发布、来源限制与 SMB 消息签名加固。",
		icon: "material-symbols:folder",
		category: "systems",
		level: "intermediate",
	},
	{
		name: "SSH 与密钥管理",
		description: "单钥单用途、免密登录与远程隧道转发。",
		icon: "material-symbols:key",
		category: "systems",
		level: "intermediate",
	},
	{
		name: "DNS 与内网解析",
		description: "本地解析服务配置与解析链路验证。",
		icon: "material-symbols:dns",
		category: "systems",
		level: "beginner",
	},
	{
		name: "systemd 服务管理",
		description: "单元编写、沙箱化约束与定时器编排。",
		icon: "material-symbols:settings",
		category: "ops",
		level: "intermediate",
	},
	{
		name: "备份与恢复策略",
		description: "异地拉取、保留策略与恢复流程验证。",
		icon: "material-symbols:backup",
		category: "ops",
		level: "intermediate",
	},
	{
		name: "GitHub Actions 流水线",
		description: "双仓 CI、内容校验门禁与自动部署。",
		icon: "simple-icons:githubactions",
		category: "ops",
		level: "intermediate",
	},
	{
		name: "监控与健康探针",
		description: "以服务可达性为判据的定时探活与自动重启。",
		icon: "material-symbols:monitor-heart",
		category: "ops",
		level: "intermediate",
	},
	{
		name: "Cloudflare（Workers、Pages、Tunnel）",
		description: "边缘部署、隧道回源与 DNS 记录治理。",
		icon: "simple-icons:cloudflare",
		category: "ops",
		level: "intermediate",
	},
	{
		name: "Docker 与容器",
		description: "容器编排与运行资源的占用治理。",
		icon: "simple-icons:docker",
		category: "ops",
		level: "beginner",
	},
	{
		name: "Shell 脚本",
		description: "排障脚本、自动化任务与加固流程落地。",
		icon: "simple-icons:gnubash",
		category: "dev",
		level: "intermediate",
	},
	{
		name: "Git 与分支管理",
		description: "站点仓与内容仓分离、部署密钥与提交规范。",
		icon: "simple-icons:git",
		category: "dev",
		level: "intermediate",
	},
	{
		name: "Python",
		description: "单文件服务、RCON 客户端与数据处理脚本。",
		icon: "simple-icons:python",
		category: "dev",
		level: "beginner",
	},
	{
		name: "Node.js",
		description: "构建工具链与内容流水线脚本。",
		icon: "simple-icons:nodedotjs",
		category: "dev",
		level: "beginner",
	},
	{
		name: "Astro",
		description: "静态站点构建、内容集合与主题配置定制。",
		icon: "simple-icons:astro",
		category: "dev",
		level: "beginner",
	},
	{
		name: "Tailscale",
		description: "私有网络组网、中继链路排查与异地设备互联。",
		icon: "simple-icons:tailscale",
		category: "tooling",
		level: "intermediate",
	},
	{
		name: "frp 内网穿透",
		description: "反向隧道部署、端口白名单与两端沙箱加固。",
		icon: "material-symbols:cable",
		category: "tooling",
		level: "intermediate",
	},
	{
		name: "Syncthing",
		description: "多设备同步拓扑、版本控制与冲突处理。",
		icon: "simple-icons:syncthing",
		category: "tooling",
		level: "intermediate",
	},
	{
		name: "AI Agent 编排（DSH）",
		description: "无头调度、插件体系与远程任务链路搭建。",
		icon: "material-symbols:hub",
		category: "tooling",
		level: "advanced",
	},
];

/** 获取所有技能数据列表 */
export function getSkillsList(): SkillItem[] {
	return skillsData;
}
