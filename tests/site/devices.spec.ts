import { expect, test } from "@playwright/test";

const DEVICE_COUNT = 9;
const NETWORK_COUNT = 2;
const CLOUD_COUNT = 2;

test.describe("设备展示页", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/devices/");
		await expect(page.locator(".device-card")).toHaveCount(DEVICE_COUNT);
	});

	test("渲染页面标题、设备卡片与状态/规格信息", async ({ page }) => {
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"devices",
		);
		await expect(page.locator(".page-header__title")).toHaveText("我的设备");
		await expect(page.locator(".devices-section__count")).toHaveText(
			"9 款设备",
		);

		const wyse = page.locator('[data-device="wyse-5070"]');
		await expect(wyse.locator("h2")).toHaveText("Dell Wyse 5070 瘦客户端");
		await expect(wyse.locator(".device-card__brand")).toHaveText("Dell");
		await expect(wyse.locator('[data-status="active"]')).toContainText(
			"主力在役",
		);
		await expect(wyse.locator(".device-card__specs")).toContainText(
			"3.6TB 合并池",
		);
		await expect(wyse).toHaveClass(/device-card--featured/);

		// 无图片设备：渲染图标瓷砖形态（不渲染媒体区）
		const thinkbook = page.locator('[data-device="thinkbook14"]');
		await expect(thinkbook.locator(".device-card__icon")).toBeVisible();
		await expect(thinkbook.locator(".device-card__media")).toHaveCount(0);
	});

	test("直接加载时导航高亮与侧栏页面过滤正确", async ({ page }) => {
		await expect(
			page.locator('[data-nav-key="devices"]').first(),
		).toHaveAttribute("aria-current", "page");
		await expect(
			page.locator('widget-layout[data-id="categories"]'),
		).toBeVisible();
		await expect(page.locator('widget-layout[data-id="tags"]')).toBeVisible();
	});

	test("场景分类筛选同步剩余设备与计数（含 LoadingIndicator 过渡）", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "网络设备", exact: true }).click();
		await expect(
			page.locator(".devices-section__loading .m3-loading--contained"),
		).toBeVisible();
		await expect(page.locator(".device-card")).toHaveCount(NETWORK_COUNT);
		await expect(page.locator(".devices-section__count")).toHaveText(
			"2 款设备",
		);
		await expect(page.locator('[data-device="r2s"]')).toBeVisible();
		await expect(page.locator('[data-device="rm2100"]')).toBeVisible();
		await expect(page.locator('[data-device="wyse-5070"]')).toHaveCount(0);
		await expect(page.locator(".devices-section__loading")).toHaveCount(0);

		// 再次点击已选分类取消筛选，恢复全部
		await page.getByRole("button", { name: "网络设备", exact: true }).click();
		await expect(page.locator(".device-card")).toHaveCount(DEVICE_COUNT);
	});

	test("搜索无结果时展示空状态反馈", async ({ page }) => {
		const searchInput = page.locator(".devices-section__search input");
		await searchInput.fill("Unknown9999");
		await expect(page.locator(".device-card")).toHaveCount(0);
		await expect(page.locator(".devices-section__empty")).toContainText(
			"没有找到匹配的设备",
		);
	});

	test("实时搜索过滤与清除（URL ?q= 同步）", async ({ page }) => {
		const searchInput = page.locator(".devices-section__search input");
		await expect(searchInput).toBeVisible();
		await searchInput.fill("Wyse");
		await expect(page.locator(".device-card")).toHaveCount(1);
		await expect(page.locator('[data-device="wyse-5070"]')).toBeVisible();
		await expect(page).toHaveURL(/[?&]q=/);

		// 清除搜索恢复全部
		const clearBtn = page.locator(".devices-section__search-clear");
		await clearBtn.click();
		await expect(page.locator(".device-card")).toHaveCount(DEVICE_COUNT);
		await expect(page).not.toHaveURL(/q=/);
	});

	test("URL 参数刷新后恢复筛选状态", async ({ page }) => {
		await page.getByRole("button", { name: "云主机", exact: true }).click();
		await expect(page).toHaveURL(/[?&]category=cloud/);
		await expect(page.locator(".device-card")).toHaveCount(CLOUD_COUNT);
		await expect(page.locator('[data-device="jufcloud"]')).toBeVisible();

		// 刷新后恢复同一次筛选
		await page.reload();
		await expect(page.locator(".device-card")).toHaveCount(CLOUD_COUNT);
		await expect(page.locator('[data-device="jufcloud"]')).toBeVisible();
		await expect(
			page.getByRole("button", { name: "云主机", exact: true }),
		).toHaveAttribute("aria-pressed", "true");
	});
});

test.describe("设备展示页 Swup 导航", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	test("从持久顶栏进入后同步页面、导航与侧栏状态", async ({ page }) => {
		await page.goto("/skills/", { waitUntil: "domcontentloaded" });
		await page.locator('a[data-nav-key="devices"]').click();

		await expect(page).toHaveURL(/\/devices\/$/);
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"devices",
		);
		await expect(page.locator(".device-card")).toHaveCount(DEVICE_COUNT);
		await expect(page.locator('a[data-nav-key="devices"]')).toHaveAttribute(
			"aria-current",
			"page",
		);
		await expect(
			page.locator('widget-layout[data-id="categories"]'),
		).toBeVisible();
		await expect(page.locator('widget-layout[data-id="tags"]')).toBeVisible();
	});
});
