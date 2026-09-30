/**
 * 设备展示页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/devicesConfig.ts 控制。
 */
import type { DeviceItem } from "@/types/devicesConfig";

export const devicesData: DeviceItem[] = [
	{
		id: "wyse-5070",
		name: "Dell Wyse 5070 瘦客户端",
		brand: "Dell",
		category: "server",
		status: "active",
		specs: "J4105 / 8GB / 120GB SSD + 3.6TB 合并池",
		description:
			"24 小时运行的自托管主机，承载文件共享、知识库服务与自动化任务，并作为异地备份的落点。",
		icon: "material-symbols:storage-rounded",
		featured: true,
		year: "2026",
	},
	{
		id: "thinkbook14",
		name: "ThinkBook 14 G4+ ARA",
		brand: "联想",
		category: "server",
		status: "active",
		specs: "Ryzen 7 6800H / 27GB / 512GB NVMe",
		description:
			"常开服务器化的主力笔记本，运行 Arch Linux 与 Hyprland，承载 Minecraft 整合包服务端与反向隧道客户端。",
		icon: "material-symbols:computer-rounded",
		year: "2026",
	},
	{
		id: "yaoshi16ultra",
		name: "机械革命耀世16 Ultra",
		brand: "机械革命",
		category: "workstation",
		status: "active",
		specs: "Windows / 本地模型推理 / 远程调度中枢",
		description:
			"主力工作终端，运行本地大模型推理服务与 Agent 调度入口，同时是知识库同步拓扑的节点之一。",
		icon: "material-symbols:desktop-windows-outline-rounded",
		year: "2026",
	},
	{
		id: "r2s",
		name: "友善 R2S",
		brand: "友善电子",
		category: "network",
		status: "active",
		specs: "双千兆 / OpenWrt / 内网网关",
		description:
			"边界路由器，承担 DNS 解析、DHCP 分配与区域防火墙，是所有入站暴露面收敛的落点。",
		icon: "material-symbols:router-outline-rounded",
		featured: true,
		year: "2026",
	},
	{
		id: "rm2100",
		name: "红米 AX2100",
		brand: "小米",
		category: "network",
		status: "active",
		specs: "纯 AP 模式 / 双频并发",
		description:
			"无线接入点，以纯 AP 模式为宿舍设备提供无线接入，客户端地址统一由边界路由器分配。",
		icon: "material-symbols:wifi-rounded",
		year: "2026",
	},
	{
		id: "jufcloud",
		name: "桔风云云机",
		brand: "桔风云",
		category: "cloud",
		status: "active",
		specs: "西安 / Paper 26.3 / 上行 15Mbps",
		description:
			"承载 Minecraft 生产服与网页地图服务的云主机，对外提供游戏接入与配套 Web 面板。",
		icon: "material-symbols:computer-rounded",
		year: "2026",
	},
	{
		id: "aliyun-ecs",
		name: "阿里云 ECS",
		brand: "阿里云",
		category: "cloud",
		status: "active",
		specs: "青岛 / 2 核 1.7GB / 反向隧道中转",
		description:
			"反向隧道中转机，为内网服务提供公网入口，同时作为远程运维的备用通道。",
		icon: "material-symbols:computer-rounded",
		year: "2026",
	},
	{
		id: "ecoflow-river3",
		name: "正浩睿3",
		brand: "正浩 EcoFlow",
		category: "iot",
		status: "active",
		specs: "户外电源 / 局域网 UPS",
		description:
			"作为局域网 UPS 接入供电链路，为宿舍断电场景提供后备电力，保障常驻主机不中断。",
		icon: "material-symbols:electrical-services-rounded",
		year: "2026",
	},
	{
		id: "cuktech-ta1208",
		name: "酷态科十号桌面充电站",
		brand: "酷态科",
		category: "iot",
		status: "active",
		specs: "TA1208 / 320×240 万象屏",
		description:
			"带屏桌面充电站，屏幕可显示自定义图像。固件升级后新增签名校验，现有第三方工具链失效。",
		icon: "material-symbols:battery-charging-full-rounded",
		year: "2026",
	},
];

/** 获取所有设备数据列表 */
export function getDevicesList(): DeviceItem[] {
	return devicesData;
}
