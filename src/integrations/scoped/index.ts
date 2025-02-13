// Modified version of: https://github.com/lilnasy/gratelets/tree/main/packages/scope

import fs from "node:fs";
// @ts-ignore
import { compile } from "./node_modules/astro/dist/core/compile/index.js";
// @ts-ignore
import { parseAstroRequest } from "./node_modules/astro/dist/vite-plugin-astro/query.js";
import type { AstroConfig, AstroIntegration } from "astro";
import type { ResolvedConfig } from "vite";
import "./types.d.ts";
// @ts-ignore
import type { AstroPreferences } from "./node_modules/astro/dist/preferences/index.js";
// @ts-ignore
import createPreferences from "./node_modules/astro/dist/preferences/index.js";

interface Options {}

export default function hfga(_: Partial<Options> = {}): AstroIntegration {
	let viteConfig: ResolvedConfig;
	let astroConfig: AstroConfig;
	let astroPreferences: AstroPreferences;
	return {
		name: "astro-scoped",
		hooks: {
			"astro:config:setup"({ updateConfig, logger }) {
				updateConfig({
					vite: {
						plugins: [
							{
								name: "astro-scoped",
								configResolved(resolvedConfig) {
									viteConfig = resolvedConfig;
								},
								resolveId(source, importer) {
									if (source !== "astro:scoped") return;

									if (importer === undefined)
										throw new Error(
											"Vite's resolveId should never be called without an importer. This is an internal error. Please open an issue with reproduction steps."
										);

									const { filename } = parseAstroRequest(importer);

									if (filename.endsWith(".astro") === false) {
										logger.error(`'astro:scoped' was imported by ${importer}`);
										throw new Error(
											"astro:scoped can only be used in .astro files"
										);
									}

									return `astro:scoped:${filename}.doesnotendwithastrodontprocessthispls`;
								},
								async load(id) {
									if (!id.startsWith("astro:scoped")) return;

									const filename = id.slice(
										"astro:scoped:".length,
										-".doesnotendwithastrodontprocessthispls".length
									);

									const result = await compile({
										astroConfig,
										viteConfig,
										preferences: astroPreferences,
										filename,
										source: fs.readFileSync(filename, "utf-8"),
									});

									return `
export function $all(selector) {
    return document.querySelectorAll(selector + "[data-astro-cid-${result.scope}]");
}

export function $each(selector, callback) {
    const elements = $all(selector);
    elements.forEach(callback);
}

export function $(selector) {
    return document.querySelector(selector + "[data-astro-cid-${result.scope}]");
}
`;
								},
							},
						],
					},
				});
			},
			"astro:config:done"({ config }) {
				astroConfig = config;
				astroPreferences = createPreferences(
					config,
					new URL("astro", import.meta.url)
				);
			},
		},
	};
}
