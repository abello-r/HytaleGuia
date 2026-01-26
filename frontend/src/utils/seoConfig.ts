export interface SEOConfig {
	title: string;
	description: string;
	keywords: string;
	ogImage?: string;
	ogType?: string;
}

interface MultiLangSEO {
	[lang: string]: SEOConfig;
}

export const SEO_CONFIGS: { [key: string]: MultiLangSEO } = {
	'/': {
		es: {
			title: 'Hytale Guía - La guía definitiva en español',
			description: 'La comunidad hispana más grande de Hytale. Explora biomas, descubre crafteos, últimas noticias, mods y únete a la aventura en Orbis.',
			keywords: 'hytale, hytale español, guía hytale, hytale wiki, comunidad hytale, noticias hytale',
			ogImage: '/og-home.png',
			ogType: 'website'
		},
		en: {
			title: 'Hytale Guide - The Ultimate Guide',
			description: 'The largest Hytale community. Explore biomes, discover crafting recipes, latest news, mods and join the adventure in Orbis.',
			keywords: 'hytale, hytale guide, hytale wiki, hytale community, hytale news',
			ogImage: '/og-home.png',
			ogType: 'website'
		},
		fr: {
			title: 'Hytale Guide - Le guide ultime',
			description: 'La plus grande communauté Hytale. Explorez les biomes, découvrez le crafting, dernières nouvelles, mods et rejoignez l\'aventure dans Orbis.',
			keywords: 'hytale, guide hytale, hytale wiki, communauté hytale, nouvelles hytale',
			ogImage: '/og-home.png',
			ogType: 'website'
		},
		pt: {
			title: 'Hytale Guia - O guia definitivo',
			description: 'A maior comunidade Hytale. Explore biomas, descubra crafting, últimas notícias, mods e junte-se à aventura em Orbis.',
			keywords: 'hytale, guia hytale, hytale wiki, comunidade hytale, notícias hytale',
			ogImage: '/og-home.png',
			ogType: 'website'
		},
		it: {
			title: 'Hytale Guida - La guida definitiva',
			description: 'La più grande comunità Hytale. Esplora biomi, scopri crafting, ultime notizie, mod e unisciti all\'avventura in Orbis.',
			keywords: 'hytale, guida hytale, hytale wiki, comunità hytale, notizie hytale',
			ogImage: '/og-home.png',
			ogType: 'website'
		}
	},
	'/noticias': {
		es: {
			title: 'Noticias de Hytale - Actualizadas cada 5 horas | Hytale Guía',
			description: 'Todas las noticias de Hytale en español. Actualizaciones oficiales, anuncios de Hypixel Studios y novedades de la comunidad. Actualizado cada 5 horas.',
			keywords: 'noticias hytale, hytale news español, actualizaciones hytale, anuncios hytale, hypixel studios',
			ogImage: '/og-news.png',
			ogType: 'website'
		},
		en: {
			title: 'Hytale News - Updated every 5 hours | Hytale Guide',
			description: 'All Hytale news. Official updates, Hypixel Studios announcements and community news. Updated every 5 hours.',
			keywords: 'hytale news, hytale updates, hytale announcements, hypixel studios',
			ogImage: '/og-news.png',
			ogType: 'website'
		},
		fr: {
			title: 'Actualités Hytale - Mises à jour toutes les 5 heures | Hytale Guide',
			description: 'Toutes les actualités Hytale. Mises à jour officielles, annonces d\'Hypixel Studios et nouveautés de la communauté. Mis à jour toutes les 5 heures.',
			keywords: 'actualités hytale, nouvelles hytale, mises à jour hytale, annonces hytale, hypixel studios',
			ogImage: '/og-news.png',
			ogType: 'website'
		},
		pt: {
			title: 'Notícias Hytale - Atualizadas a cada 5 horas | Hytale Guia',
			description: 'Todas as notícias do Hytale. Atualizações oficiais, anúncios da Hypixel Studios e novidades da comunidade. Atualizado a cada 5 horas.',
			keywords: 'notícias hytale, atualizações hytale, anúncios hytale, hypixel studios',
			ogImage: '/og-news.png',
			ogType: 'website'
		},
		it: {
			title: 'Notizie Hytale - Aggiornate ogni 5 ore | Hytale Guida',
			description: 'Tutte le notizie di Hytale. Aggiornamenti ufficiali, annunci di Hypixel Studios e novità della comunità. Aggiornato ogni 5 ore.',
			keywords: 'notizie hytale, aggiornamenti hytale, annunci hytale, hypixel studios',
			ogImage: '/og-news.png',
			ogType: 'website'
		}
	},
	'/mods': {
		es: {
			title: 'Mods de Hytale - Descubre y descarga | Hytale Guía',
			description: 'Explora los mejores mods de Hytale creados por la comunidad. Nuevas mecánicas, herramientas y contenido adicional para enriquecer tu experiencia en Orbis.',
			keywords: 'mods hytale, descargar mods hytale, hytale modding, modificaciones hytale, addons hytale',
			ogImage: '/og-mods.png',
			ogType: 'website'
		},
		en: {
			title: 'Hytale Mods - Discover and download | Hytale Guide',
			description: 'Explore the best community-created Hytale mods. New mechanics, tools and additional content to enrich your Orbis experience.',
			keywords: 'hytale mods, download hytale mods, hytale modding, hytale modifications, hytale addons',
			ogImage: '/og-mods.png',
			ogType: 'website'
		},
		fr: {
			title: 'Mods Hytale - Découvrir et télécharger | Hytale Guide',
			description: 'Explorez les meilleurs mods Hytale créés par la communauté. Nouvelles mécaniques, outils et contenu supplémentaire pour enrichir votre expérience dans Orbis.',
			keywords: 'mods hytale, télécharger mods hytale, modding hytale, modifications hytale, addons hytale',
			ogImage: '/og-mods.png',
			ogType: 'website'
		},
		pt: {
			title: 'Mods Hytale - Descubra e baixe | Hytale Guia',
			description: 'Explore os melhores mods do Hytale criados pela comunidade. Novas mecânicas, ferramentas e conteúdo adicional para enriquecer sua experiência em Orbis.',
			keywords: 'mods hytale, baixar mods hytale, modding hytale, modificações hytale, addons hytale',
			ogImage: '/og-mods.png',
			ogType: 'website'
		},
		it: {
			title: 'Mod Hytale - Scopri e scarica | Hytale Guida',
			description: 'Esplora le migliori mod di Hytale create dalla comunità. Nuove meccaniche, strumenti e contenuti aggiuntivi per arricchire la tua esperienza in Orbis.',
			keywords: 'mod hytale, scaricare mod hytale, modding hytale, modifiche hytale, addon hytale',
			ogImage: '/og-mods.png',
			ogType: 'website'
		}
	}
};

export const DEFAULT_SEO: MultiLangSEO = {
	es: {
		title: 'Hytale Guía - La guía definitiva en español',
		description: 'La comunidad hispana más grande de Hytale. Noticias, mods, guías, servidores y bug tracker. Todo sobre Hytale en español.',
		keywords: 'hytale, hytale español, guía hytale',
		ogImage: '/og-default.png',
		ogType: 'website'
	},
	en: {
		title: 'Hytale Guide - The Ultimate Guide',
		description: 'The largest Hytale community. News, mods, guides, servers and bug tracker. Everything about Hytale.',
		keywords: 'hytale, hytale guide, hytale wiki',
		ogImage: '/og-default.png',
		ogType: 'website'
	},
	fr: {
		title: 'Hytale Guide - Le guide ultime',
		description: 'La plus grande communauté Hytale. Nouvelles, mods, guides, serveurs et bug tracker. Tout sur Hytale.',
		keywords: 'hytale, guide hytale, hytale wiki',
		ogImage: '/og-default.png',
		ogType: 'website'
	},
	pt: {
		title: 'Hytale Guia - O guia definitivo',
		description: 'A maior comunidade Hytale. Notícias, mods, guias, servidores e bug tracker. Tudo sobre Hytale.',
		keywords: 'hytale, guia hytale, hytale wiki',
		ogImage: '/og-default.png',
		ogType: 'website'
	},
	it: {
		title: 'Hytale Guida - La guida definitiva',
		description: 'La più grande comunità Hytale. Notizie, mod, guide, server e bug tracker. Tutto su Hytale.',
		keywords: 'hytale, guida hytale, hytale wiki',
		ogImage: '/og-default.png',
		ogType: 'website'
	}
};

// Helper function to get SEO config for current language
export const getSEOConfig = (path: string, language: string = 'es'): SEOConfig => {
	const pageConfig = SEO_CONFIGS[path];
	const defaultConfig = DEFAULT_SEO[language] || DEFAULT_SEO.es;

	if (!pageConfig) return defaultConfig;

	return pageConfig[language] || pageConfig.es || defaultConfig;
};
