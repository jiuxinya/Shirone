import { expect, test } from "@playwright/test";

const SKILL_COUNT = 22;
const SYSTEMS_COUNT = 7;

test.describe("技能页", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/skills/");
		await expect(page.locator(".skill-card")).toHaveCount(SKILL_COUNT);
	});

	test("渲染配置技能与离散熟练度", async ({ page }) => {
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"skills",
		);
		await expect(page.locator(".page-header__title")).toHaveText("技能");
		await expect(page.locator(".skills-section__count")).toHaveText(
			"22 项技能",
		);

		const linux = page.locator(".skill-card", { hasText: "Linux 系统运维" });
		await expect(linux).toHaveAttribute("data-level", "advanced");
		await expect(linux).toContainText("熟练");
		await expect(linux.getByRole("meter")).toHaveAttribute(
			"aria-valuenow",
			"3",
		);
		await expect(linux.locator(".skill-card__segment--active")).toHaveCount(3);
	});

	test("分类 chips 可筛选并再次点击恢复全部", async ({ page }) => {
		const systems = page.getByRole("button", {
			name: "系统与网络",
			exact: true,
		});
		await systems.click();
		await expect(systems).toHaveAttribute("aria-pressed", "true");
		await expect(page.locator(".skill-card")).toHaveCount(SYSTEMS_COUNT);

		await systems.click();
		await expect(systems).toHaveAttribute("aria-pressed", "false");
		await expect(page.locator(".skill-card")).toHaveCount(SKILL_COUNT);
	});

	test("侧栏页面过滤与直接加载导航高亮正确", async ({ page }) => {
		await expect(
			page.locator('widget-layout[data-id="categories"]'),
		).toBeVisible();
		await expect(page.locator('widget-layout[data-id="tags"]')).toBeVisible();
		await expect(
			page.locator('[data-nav-key="skills"]').first(),
		).toHaveAttribute("aria-current", "page");
	});
});

test.describe("技能页 Swup 导航", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	test("从持久顶栏进入后同步页面、导航与侧栏状态", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.locator('a[data-nav-key="skills"]').click();

		await expect(page).toHaveURL(/\/skills\/$/);
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"skills",
		);
		await expect(page.locator(".skill-card")).toHaveCount(SKILL_COUNT);
		await expect(page.locator('a[data-nav-key="skills"]')).toHaveAttribute(
			"aria-current",
			"page",
		);
		await expect(
			page.locator('widget-layout[data-id="categories"]'),
		).toBeVisible();
		await expect(page.locator('widget-layout[data-id="tags"]')).toBeVisible();
	});
});
