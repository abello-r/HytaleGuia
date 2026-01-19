export interface SEOConfig {
	title: string;
	description: string;
	keywords: string;
	ogImage?: string;
	canonical?: string;
	ogType?: string;
}

export const SEO_CONFIGS: { [key: string]: SEOConfig } = {
	'/': {
		title: 'HytaleGuía - Tu guía definitiva para Hytale',
		description: 'Descubre las últimas noticias, guías completas, mods y recursos para Hytale. La comunidad hispana más activa del juego de Hypixel Studios.',
		keywords: 'hytale, hytale guía, noticias hytale, mods hytale, guías hytale, hypixel studios, orbis',
		ogImage: 'https://hytaleguia.com/og-home.jpg',
		canonical: 'https://hytaleguia.com/',
		ogType: 'website'
	},
	'/noticias': {
		title: 'Noticias de Hytale - Últimas actualizaciones | HytaleGuía',
		description: 'Mantente al día con las últimas noticias, actualizaciones y anuncios oficiales de Hytale. Cobertura diaria en español.',
		keywords: 'noticias hytale, actualizaciones hytale, hytale news, anuncios hytale, noticias hypixel studios',
		ogImage: 'https://hytaleguia.com/og-news.jpg',
		canonical: 'https://hytaleguia.com/noticias',
		ogType: 'website'
	},
	'/mods': {
		title: 'Mods para Hytale - Descubre y descarga | HytaleGuía',
		description: 'Explora la colección más completa de mods para Hytale. Nuevas mecánicas, mejoras de calidad de vida y contenido adicional creado por la comunidad.',
		keywords: 'mods hytale, descargar mods hytale, modificaciones hytale, hytale mods español, addons hytale',
		ogImage: 'https://hytaleguia.com/og-mods.jpg',
		canonical: 'https://hytaleguia.com/mods',
		ogType: 'website'
	}
};

export const DEFAULT_SEO: SEOConfig = {
	title: 'HytaleGuía',
	description: 'La guía definitiva para Hytale en español',
	keywords: 'hytale, guía, noticias, mods',
	ogImage: 'https://hytaleguia.com/og-default.jpg',
	ogType: 'website'
};
