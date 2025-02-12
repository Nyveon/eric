// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import scoped from "./src/integrations/scoped";

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
	},

	experimental: {
		contentIntellisense: true,
	},

	i18n: {
		locales: ["en", "es"],
		defaultLocale: "en",
	},

	integrations: [icon(), scoped()],
});
