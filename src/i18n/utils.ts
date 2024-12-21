import type { GetStaticPathsResult } from "astro";
import { getRelativeLocaleUrl } from "astro:i18n";

enum LangCode {
	EN = "en",
	ES = "es",
}

export const defaultLang = LangCode.EN;

const localizations = {
	[LangCode.EN]: {
		pages: {
			home: "Home Page",
			about: "About",
			blog: "Blog",
		},
		home: {
			subtitle: "¡Hello World!",
		},
		e404: {
			title: "Page Not Found",
			text: "Are you sure you have the right URL?",
		},
	},
	[LangCode.ES]: {
		pages: {
			home: "Inicio",
			about: "Acerca de",
			blog: "Blog",
		},
		home: {
			subtitle: "¡Hola, mundo!",
		},
		e404: {
			title: "Página no encontrada",
			text: "La URL podría estar incorrecta.",
		},
	},
} as const;

export function useLocalization(lang: string | undefined) {
	let locale = defaultLang;

	if (lang === LangCode.EN || lang === LangCode.ES) {
		locale = lang;
	}

	return {
		t: localizations[locale],
		h: (path: string) => getRelativeLocaleUrl(locale, path),
	};
}

export const getStaticPaths = (): GetStaticPathsResult => [
	...Object.values(LangCode).map((lang) => ({
		params: { lang },
	})),
	{ params: { lang: undefined } },
];

export function perLocaleStaticPaths<T extends GetStaticPathsResult>(
	basePaths: T
): T {
	const langPaths = getStaticPaths();

	const paths = langPaths.flatMap((langPath) => {
		return basePaths.map((path) => {
			return {
				...path,
				params: { lang: langPath.params.lang, ...path.params },
			};
		});
	});

	return paths as unknown as T;
}
