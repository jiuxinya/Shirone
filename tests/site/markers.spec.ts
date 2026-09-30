import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const POST_PATH = "/posts/marker-highlights/";

async function openPost(page: import("@playwright/test").Page) {
	await page.goto(POST_PATH, { waitUntil: "domcontentloaded" });
	await page.waitForFunction(() =>
		document.documentElement.style
			.getPropertyValue("--mc-primary")
			.trim()
			.startsWith("#"),
	);
	return page.locator(".custom-md .m3-marker");
}

test.describe("Markdown marker highlights", () => {
	test("renders native marks with the Obsidian highlight fill", async ({
		page,
	}) => {
		const markers = await openPost(page);
		await expect(markers).toHaveCount(7);
		await expect(page.locator(".custom-md mark.m3-marker")).toHaveCount(7);

		const variants = await markers.evaluateAll((elements) =>
			elements.map((element) => element.getAttribute("data-marker")),
		);
		expect(variants).toEqual([
			"primary",
			"primary",
			"primary",
			"secondary",
			"tertiary",
			"error",
			"tip",
		]);

		const geometry = await markers.evaluateAll((elements) =>
			elements.map((element) => {
				const style = getComputedStyle(element);
				return {
					background: style.backgroundColor,
					borderRadius: Number.parseFloat(style.borderRadius),
					boxShadow: style.boxShadow,
					fontWeight: style.fontWeight,
				};
			}),
		);
		// 默认变体沿用 Obsidian `==高亮==` 的固定黄底块（`better-hight` 片段），
		// 其余变体继续用 M3E 语义色填充；全部为实心底色而非 inset 下划线。
		for (const [index, marker] of geometry.entries()) {
			expect(marker.background).not.toBe("rgba(0, 0, 0, 0)");
			expect(marker.borderRadius).toBe(3);
			expect(marker.boxShadow).toBe("none");
			expect(marker.fontWeight).not.toBe("600");
			if (index < 3) {
				expect(marker.background).toBe("rgba(255, 208, 0, 0.3)");
			}
		}

		const results = await new AxeBuilder({ page })
			.include(".markdown-content")
			.analyze();
		expect(results.violations).toEqual([]);
	});

	test("wraps within a narrow article without horizontal overflow", async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.setViewportSize({ width: 390, height: 844 });
		const markers = await openPost(page);

		const geometry = await markers.evaluateAll((elements) => ({
			hasPageOverflow:
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth + 1,
			hasMarkerOverflow: elements.some(
				(element) => element.scrollWidth > element.clientWidth + 1,
			),
		}));

		expect(geometry.hasPageOverflow).toBe(false);
		expect(geometry.hasMarkerOverflow).toBe(false);
	});
});
