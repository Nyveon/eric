import { IdAttributePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(IdAttributePlugin);

	eleventyConfig.addPassthroughCopy("./src/css");
	eleventyConfig.addPassthroughCopy("./src/js");
	eleventyConfig.addPassthroughCopy("./src/img");
	eleventyConfig.addPassthroughCopy("./src/fonts");
	eleventyConfig.addPassthroughCopy({
		"./src/config/robots.txt": "/robots.txt",
	});

	eleventyConfig.setInputDirectory("src");
	eleventyConfig.setDataDirectory("data");
	eleventyConfig.setIncludesDirectory("includes");
	eleventyConfig.setOutputDirectory("_site");

	eleventyConfig.setServerOptions({
		watch: ["./_site/css/*.css"],
	});
}
