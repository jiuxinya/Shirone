import { expect, test } from "@playwright/test";

const PROJECT_COUNT = 5;
const SELFHOSTED_COUNT = 2;

test.describe("项目页", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/projects/");
		await expect(page.locator(".project-card")).toHaveCount(PROJECT_COUNT);
	});

	test("渲染项目条目、阶段、技术栈与站点链接", async ({ page }) => {
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"projects",
		);
		await expect(page.locator(".page-header__title")).toHaveText("项目");
		await expect(page.locator(".projects-section__count")).toHaveText(
			"5 个项目",
		);

		const homeNetwork = page.locator('[data-project="home-network"]');
		await expect(homeNetwork.locator("h2")).toHaveText("家庭网络基建");
		await expect(homeNetwork).toHaveClass(/project-card--featured/);
		await expect(homeNetwork.locator('[data-phase="building"]')).toHaveText(
			"构建中",
		);
		await expect(
			homeNetwork.locator(".project-card__technologies li"),
		).toHaveCount(5);

		// 无封面项目：渲染图标瓷砖形态（不渲染封面区）
		const homelab = page.locator('[data-project="homelab"]');
		await expect(homelab.locator(".project-card__icon")).toBeVisible();
		await expect(homelab.locator(".project-card__cover")).toHaveCount(0);
		await expect(homelab.locator('[data-phase="shipped"]')).toHaveText(
			"已发布",
		);

		// 带站点链接的项目在操作区渲染外链
		const blog = page.locator('[data-project="aetheris-blog"]');
		await expect(
			blog.locator(
				'.project-card__actions a[href="https://blog.jiuxinya.xyz"]',
			),
		).toBeVisible();
	});

	test("直接加载时导航高亮与侧栏页面过滤正确", async ({ page }) => {
		await expect(
			page.locator('[data-nav-key="projects"]').first(),
		).toHaveAttribute("aria-current", "page");
		await expect(
			page.locator('widget-layout[data-id="categories"]'),
		).toBeVisible();
		await expect(page.locator('widget-layout[data-id="tags"]')).toBeVisible();
	});

	test("分类筛选会同步项目数量与可见卡片（含 LoadingIndicator 过渡）", async ({
		page,
	}) => {
		await page
			.getByRole("button", { name: "自托管与运维", exact: true })
			.click();
		// 三段过渡的指示器阶段（contained LoadingIndicator 出现在内容区）
		await expect(
			page.locator(".projects-section__loading .m3-loading--contained"),
		).toBeVisible();
		await expect(page.locator(".project-card")).toHaveCount(SELFHOSTED_COUNT);
		await expect(page.locator(".projects-section__count")).toHaveText(
			"2 个项目",
		);
		await expect(page.locator('[data-project="home-network"]')).toHaveCount(0);
		await expect(page.locator('[data-project="nfwc-server"]')).toBeVisible();
		await expect(page.locator('[data-project="homelab"]')).toBeVisible();
		await expect(page.locator(".projects-section__loading")).toHaveCount(0);

		await page
			.getByRole("button", { name: "自托管与运维", exact: true })
			.click();
		await expect(page.locator(".project-card")).toHaveCount(PROJECT_COUNT);
	});

	test("实时搜索过滤与清除（URL ?q= 同步）", async ({ page }) => {
		const searchInput = page.locator(".projects-section__search input");
		await expect(searchInput).toBeVisible();
		await searchInput.fill("家庭网络");
		await expect(page.locator(".project-card")).toHaveCount(1);
		await expect(page.locator('[data-project="home-network"]')).toBeVisible();
		await expect(page).toHaveURL(/[?&]q=/);

		// 清除搜索恢复全部
		const clearBtn = page.locator(".projects-section__search-clear");
		await clearBtn.click();
		await expect(page.locator(".project-card")).toHaveCount(PROJECT_COUNT);
		await expect(page).not.toHaveURL(/q=/);
	});

	test("桌面与手机布局之间无刷新切换时重置瀑布流定位", async ({ page }) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		const grid = page.locator(".projects-section__grid");
		const cards = page.locator(".project-card");

		await expect
			.poll(() =>
				grid.evaluate(
					(element) =>
						getComputedStyle(element)
							.gridTemplateColumns.split(" ")
							.filter(Boolean).length,
				),
			)
			.toBeGreaterThan(1);
		await expect
			.poll(() =>
				cards.evaluateAll((elements) =>
					elements.every(
						(element) =>
							(element as HTMLElement).style.gridColumnStart !== "" &&
							(element as HTMLElement).style.gridRowEnd !== "",
					),
				),
			)
			.toBe(true);
		await expect
			.poll(() =>
				cards.evaluateAll((elements) =>
					elements.every(
						(element) => getComputedStyle(element).gridColumnEnd === "span 1",
					),
				),
			)
			.toBe(true);

		await page.setViewportSize({ width: 390, height: 844 });

		await expect
			.poll(() =>
				grid.evaluate(
					(element) =>
						getComputedStyle(element)
							.gridTemplateColumns.split(" ")
							.filter(Boolean).length,
				),
			)
			.toBe(1);
		await expect
			.poll(() =>
				cards.evaluateAll((elements) =>
					elements.every(
						(element) =>
							(element as HTMLElement).style.gridColumnStart === "" &&
							(element as HTMLElement).style.gridRowEnd === "",
					),
				),
			)
			.toBe(true);
		await expect(cards).toHaveCount(PROJECT_COUNT);
		await expect(page).toHaveURL(/\/projects\/$/);

		await page.setViewportSize({ width: 1600, height: 900 });

		await expect
			.poll(() =>
				cards.evaluateAll((elements) =>
					elements.every(
						(element) =>
							(element as HTMLElement).style.gridColumnStart !== "" &&
							(element as HTMLElement).style.gridRowEnd !== "",
					),
				),
			)
			.toBe(true);
	});

	test("无封面卡片在桌面端将技术栈与操作区合并为同一行", async ({ page }) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await expect(page.locator(".project-card--without-cover")).toHaveCount(
			PROJECT_COUNT,
		);

		// 仅检查同时渲染了技术栈与操作区的卡片（无链接的项目不渲染操作区）
		const cards = page.locator(
			".project-card--without-cover:has(.project-card__actions)",
		);
		await expect(cards).not.toHaveCount(0);

		const rowsMerged = await cards.evaluateAll((elements) =>
			elements.every((element) => {
				const card = element as HTMLElement;
				const technologies = card.querySelector<HTMLElement>(
					".project-card__technologies",
				);
				const actions = card.querySelector<HTMLElement>(
					".project-card__actions",
				);
				if (!technologies || !actions) return false;
				const techBox = technologies.getBoundingClientRect();
				const actionsBox = actions.getBoundingClientRect();
				// 同一行：两个区域的垂直范围必须重叠
				return (
					techBox.top < actionsBox.bottom && actionsBox.top < techBox.bottom
				);
			}),
		);

		await expect(rowsMerged).toBe(true);
	});
});

test.describe("项目页 Swup 导航", () => {
	test.use({ viewport: { width: 1600, height: 900 } });

	test("从持久顶栏进入后同步页面、导航与侧栏状态", async ({ page }) => {
		await page.goto("/skills/", { waitUntil: "domcontentloaded" });
		await page.locator('a[data-nav-key="projects"]').click();

		await expect(page).toHaveURL(/\/projects\/$/);
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"projects",
		);
		await expect(page.locator(".project-card")).toHaveCount(PROJECT_COUNT);
		await expect(page.locator('a[data-nav-key="projects"]')).toHaveAttribute(
			"aria-current",
			"page",
		);
		await expect(
			page.locator('widget-layout[data-id="categories"]'),
		).toBeVisible();
		await expect(page.locator('widget-layout[data-id="tags"]')).toBeVisible();
	});
});
