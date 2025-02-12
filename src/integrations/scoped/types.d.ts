declare module "astro:scoped" {
	export function $(selector: string): HTMLElement;

	export function $all(selector: string): NodeListOf<HTMLElement>;

	export function $each(
		selector: string,
		callback: (element: HTMLElement) => void
	): void;
}
