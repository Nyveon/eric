// @ts-check
// @ts-check
import { defineConfig } from "astro/config";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern-compiler",
				},
			},
		},
		plugins: [
			visualizer({
				emitFile: false,
				filename: "stats.html",
				open: true,
				template: "sunburst",
			}),
		],
	},
});
