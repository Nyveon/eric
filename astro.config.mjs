// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";
// import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
  site: "https://eric.tc",

  vite: {
      css: {
          preprocessorOptions: {
              scss: {
                  api: "modern-compiler",
              },
          },
      },
      plugins: [
          // visualizer({
          // 	emitFile: false,
          // 	filename: "stats.html",
          // 	open: true,
          // 	template: "sunburst",
          // }),
      ],
	},

  experimental: {
      contentIntellisense: true,
	},

  i18n: {
      locales: ["en", "es"],
      defaultLocale: "en",
	},

  integrations: [icon()],
});