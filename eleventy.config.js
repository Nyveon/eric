import { IdAttributePlugin } from "@11ty/eleventy";



export default function (eleventyConfig) {
    eleventyConfig.addPlugin(IdAttributePlugin);

	eleventyConfig.addPassthroughCopy("./src/css");
	eleventyConfig.addPassthroughCopy("./src/js");
	eleventyConfig.addPassthroughCopy("./src/img");
	eleventyConfig.addPassthroughCopy("./src/fonts");

    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setDataDirectory("data");
    eleventyConfig.setIncludesDirectory("includes");
    eleventyConfig.setOutputDirectory("docs");
};
