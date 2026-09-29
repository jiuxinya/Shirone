// 内容校验：Markdown 里的相对图片引用必须指向真实存在的文件。
// 用法：node scripts/content/check-asset-refs.mjs [--dir <内容目录>]
//   --dir 缺省时读取环境变量 CONTENT_DIR，再缺省为当前目录。
//
// 背景：Obsidian 默认的链接格式（shortest）在文件名唯一时只写裸文件名，
// 于是 `![](Screenshot.png)` 会被解析成文章同级目录下的文件，而图片其实在
// `attachments/` 子目录里；这类引用只有到 astro build 阶段才会以
// ImageNotFound 失败，本脚本把它提前到内容校验阶段暴露。
//
// 通过 = 所有相对引用都能解析到文件；失败 = 打印 文件:行号 + 引用路径并 exit 1。

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const SKIPPED_DIRECTORIES = new Set([".git", "node_modules"]);
const MARKDOWN_PATTERN = /\.mdx?$/i;
// ![](path) / ![alt](<path with space>) / ![alt](path "title")
const IMAGE_REFERENCE_PATTERN = /!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^)\s]+))/g;
// 外部链接、协议相对链接与站点绝对路径（指向 public/）都不参与文件系统校验。
const NON_RELATIVE_PREFIX = /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i;

function printUsage() {
	console.log(
		[
			"Usage: node scripts/content/check-asset-refs.mjs [--dir <directory>]",
			"",
			"  --dir <dir>   Markdown content root to scan (defaults to $CONTENT_DIR, then cwd)",
		].join("\n"),
	);
}

function parseDirectory() {
	const args = process.argv.slice(2);
	let directory = null;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (arg === "--help" || arg === "-h") {
			printUsage();
			process.exit(0);
		}
		if (arg === "--dir") {
			directory = args[index + 1];
			index += 1;
			if (!directory) {
				console.error("[assets] --dir requires a directory path.");
				process.exit(1);
			}
			continue;
		}
		console.error(`[assets] unsupported argument: ${arg}. Run --help for usage.`);
		process.exit(1);
	}
	return resolve(process.cwd(), directory ?? process.env.CONTENT_DIR ?? ".");
}

function collectMarkdown(directory, accumulator = []) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		if (SKIPPED_DIRECTORIES.has(entry.name)) continue;
		const fullPath = join(directory, entry.name);
		if (entry.isDirectory()) collectMarkdown(fullPath, accumulator);
		else if (MARKDOWN_PATTERN.test(entry.name)) accumulator.push(fullPath);
	}
	return accumulator;
}

/** 把引用还原成文件系统相对路径；外部链接与站点绝对路径返回 null。 */
function toLocalReference(rawReference) {
	const trimmed = rawReference.trim();
	if (trimmed === "" || NON_RELATIVE_PREFIX.test(trimmed)) return null;
	const withoutFragment = trimmed.split(/[?#]/)[0];
	if (withoutFragment === "") return null;
	try {
		return decodeURIComponent(withoutFragment);
	} catch {
		return withoutFragment;
	}
}

function lineNumberAt(source, offset) {
	let line = 1;
	for (let index = 0; index < offset; index += 1) {
		if (source[index] === "\n") line += 1;
	}
	return line;
}

const contentRoot = parseDirectory();
if (!existsSync(contentRoot) || !statSync(contentRoot).isDirectory()) {
	console.error(`[assets] content directory does not exist: ${contentRoot}`);
	process.exit(1);
}

const problems = [];
let referenceCount = 0;

const markdownFiles = collectMarkdown(contentRoot);
for (const filePath of markdownFiles) {
	const source = readFileSync(filePath, "utf8");
	const relativeFile = filePath.slice(contentRoot.length + 1).split("\\").join("/");
	const pattern = new RegExp(IMAGE_REFERENCE_PATTERN.source, "g");
	for (const match of source.matchAll(pattern)) {
		const reference = toLocalReference(match[1] ?? match[2] ?? "");
		if (!reference) continue;
		referenceCount += 1;
		const absolute = resolve(dirname(filePath), reference);
		if (existsSync(absolute) && statSync(absolute).isFile()) continue;
		problems.push({
			file: relativeFile,
			line: lineNumberAt(source, match.index),
			reference,
		});
	}
}

if (problems.length === 0) {
	console.log(
		`[assets] checked ${markdownFiles.length} markdown file(s) and ${referenceCount} local image reference(s), all resolved`,
	);
} else {
	console.error(`[assets] ${problems.length} unresolvable image reference(s):`);
	for (const problem of problems) {
		console.error(`  ${problem.file}:${problem.line}  ${problem.reference}`);
	}
	console.error("");
	console.error("[assets] 相对引用按 Markdown 文件所在目录解析，路径必须真实存在。");
	console.error("[assets] Obsidian 侧请把「设置 > 文件与链接 > 新链接格式」设为「相对路径」，");
	console.error("[assets] 否则插入的图片只会写成裸文件名，缺 attachments/ 前缀。");
	process.exitCode = 1;
}
