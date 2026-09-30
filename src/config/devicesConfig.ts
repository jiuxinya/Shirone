import type { DevicesConfig } from "@/types/devicesConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 设备展示页行为与展示配置。
 *
 * 遵循「配置管行为，数据管内容」原则：
 * - enable：页面总开关；false 时导航入口同步隐藏，访问 /devices/ 跳转 404；
 * - categories：场景分类清单（数组顺序即页面顶部 Chips 顺序）；
 * - disabledIds：可选被禁用的设备 ID 列表；
 *
 * 注：设备的具体清单数据（设备名、品牌、规格、感受说明、图片等）请在 `src/data/devices.ts` 中维护。
 */
export const devicesConfig: DevicesConfig = withUserConfig("devices", {
	enable: true,
	title: "$t:devices",
	description:
		"一套 24 小时运行的家庭实验室：主力终端、常驻服务器、边界网络、云主机与供电设备。",
	categories: [
		{
			key: "workstation",
			label: "主力终端",
			icon: "material-symbols:desktop-windows-outline-rounded",
			description: "日常使用的工作终端与调度中枢",
		},
		{
			key: "server",
			label: "常驻服务",
			icon: "material-symbols:storage-rounded",
			description: "7×24 运行的自托管与计算主机",
		},
		{
			key: "network",
			label: "网络设备",
			icon: "material-symbols:router-outline-rounded",
			description: "边界路由与无线接入",
		},
		{
			key: "cloud",
			label: "云主机",
			icon: "material-symbols:computer-rounded",
			description: "对外服务承载与隧道中转",
		},
		{
			key: "iot",
			label: "IoT 与供电",
			icon: "material-symbols:electrical-services-rounded",
			description: "供电保障与带屏物联设备",
		},
	],
	// disabledIds: [],
});
