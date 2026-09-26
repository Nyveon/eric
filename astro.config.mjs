// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    site: "https://eric.tc/",
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [icon()],
    fonts: [
        {
            provider: fontProviders.fontsource(),
            name: "Lato",
            cssVariable: "--font-x",
            weights: ["100", "400", "700"],
        },
    ],
});
