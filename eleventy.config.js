import { IdAttributePlugin } from "@11ty/eleventy";
import { minify } from "terser";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(IdAttributePlugin);

	eleventyConfig.addPassthroughCopy("./src/css");
	eleventyConfig.addPassthroughCopy("./src/img");
	eleventyConfig.addPassthroughCopy("./src/fonts");
	eleventyConfig.addPassthroughCopy({
		"./src/config/robots.txt": "/robots.txt",
	});

	eleventyConfig.addFilter("jsmin", async function (code) {
		try {
			const minified = await minify(code);
			return minified.code;
		} catch (err) {
			console.error("Terser error: ", err);
			return code;
		}
	});

	eleventyConfig.setInputDirectory("src");
	eleventyConfig.setDataDirectory("data");
	eleventyConfig.setIncludesDirectory("includes");
	eleventyConfig.setOutputDirectory("_site");

	eleventyConfig.setServerOptions({
		watch: ["./_site/css/*.css"],
	});
}
