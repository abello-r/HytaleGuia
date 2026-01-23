// seoConfig.ts
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
		title: 'HytaleGuía - La Enciclopedia Definitiva de Hytale en Español',
		description: 'La comunidad hispana más grande de Hytale. Noticias actualizadas cada 5 horas, mods, guías, servidores y bug tracker. Todo sobre Hytale en español.',
		keywords: 'hytale, hytale español, hytaleguia, guía hytale, noticias hytale, mods hytale, servidores hytale, comunidad hytale español, hypixel studios',
		ogImage: 'https://hytaleguia.com/og-home.jpg',
		canonical: 'https://hytaleguia.com/',
		ogType: 'website'
	},
	'/noticias': {
		title: 'Noticias de Hytale en Español - Actualizadas cada 5 horas | HytaleGuía',
		description: 'Últimas noticias de Hytale actualizadas automáticamente cada 5 horas. Anuncios oficiales de Hypixel Studios, novedades de la comunidad y actualizaciones del juego.',
		keywords: 'noticias hytale, novedades hytale, hytale news español, actualizaciones hytale, anuncios hypixel studios',
		ogImage: 'https://hytaleguia.com/og-news.jpg',
		canonical: 'https://hytaleguia.com/noticias',
		ogType: 'website'
	},
	'/mods': {
		title: 'Mods de Hytale - Descarga Modificaciones de la Comunidad | HytaleGuía',
		description: 'Catálogo completo de mods para Hytale. Descarga modificaciones de gameplay, gráficos y optimización. Actualizaciones diarias con las últimas creaciones de la comunidad.',
		keywords: 'mods hytale, descargar mods hytale, modificaciones hytale, hytale modding, mods hytale español, mejores mods hytale',
		ogImage: 'https://hytaleguia.com/og-mods.jpg',
		canonical: 'https://hytaleguia.com/mods',
		ogType: 'website'
	},
	'/bugs': {
		title: 'Bug Tracker de Hytale - Reporte de Errores y Bugs | HytaleGuía',
		description: 'Sistema de seguimiento de bugs reportados en Hytale. Consulta errores conocidos, severidad, estado de corrección y reporta nuevos problemas.',
		keywords: 'bugs hytale, errores hytale, bug tracker hytale, reportar bugs hytale, problemas hytale',
		ogImage: 'https://hytaleguia.com/og-bugs.jpg',
		canonical: 'https://hytaleguia.com/bugs',
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
