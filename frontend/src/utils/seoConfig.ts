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
			ogImage: '/news_paper.jpeg',
			ogType: 'website'
		},
		en: {
			title: 'Hytale News - Updated every 5 hours | Hytale Guide',
			description: 'All Hytale news. Official updates, Hypixel Studios announcements and community news. Updated every 5 hours.',
			keywords: 'hytale news, hytale updates, hytale announcements, hypixel studios',
			ogImage: '/news_paper.jpeg',
			ogType: 'website'
		},
		fr: {
			title: 'Actualités Hytale - Mises à jour toutes les 5 heures | Hytale Guide',
			description: 'Toutes les actualités Hytale. Mises à jour officielles, annonces d\'Hypixel Studios et nouveautés de la communauté. Mis à jour toutes les 5 heures.',
			keywords: 'actualités hytale, nouvelles hytale, mises à jour hytale, annonces hytale, hypixel studios',
			ogImage: '/news_paper.jpeg',
			ogType: 'website'
		},
		pt: {
			title: 'Notícias Hytale - Atualizadas a cada 5 horas | Hytale Guia',
			description: 'Todas as notícias do Hytale. Atualizações oficiais, anúncios da Hypixel Studios e novidades da comunidade. Atualizado a cada 5 horas.',
			keywords: 'notícias hytale, atualizações hytale, anúncios hytale, hypixel studios',
			ogImage: '/news_paper.jpeg',
			ogType: 'website'
		},
		it: {
			title: 'Notizie Hytale - Aggiornate ogni 5 ore | Hytale Guida',
			description: 'Tutte le notizie di Hytale. Aggiornamenti ufficiali, annunci di Hypixel Studios e novità della comunità. Aggiornato ogni 5 ore.',
			keywords: 'notizie hytale, aggiornamenti hytale, annunci hytale, hypixel studios',
			ogImage: '/news_paper.jpeg',
			ogType: 'website'
		}
	},
	'/mods': {
		es: {
			title: 'Mods de Hytale - Descubre y descarga | Hytale Guía',
			description: 'Explora los mejores mods de Hytale creados por la comunidad. Nuevas mecánicas, herramientas y contenido adicional para enriquecer tu experiencia en Orbis.',
			keywords: 'mods hytale, descargar mods hytale, hytale modding, modificaciones hytale, addons hytale',
			ogImage: '/mods.jpeg',
			ogType: 'website'
		},
		en: {
			title: 'Hytale Mods - Discover and download | Hytale Guide',
			description: 'Explore the best community-created Hytale mods. New mechanics, tools and additional content to enrich your Orbis experience.',
			keywords: 'hytale mods, download hytale mods, hytale modding, hytale modifications, hytale addons',
			ogImage: '/mods.jpeg',
			ogType: 'website'
		},
		fr: {
			title: 'Mods Hytale - Découvrir et télécharger | Hytale Guide',
			description: 'Explorez les meilleurs mods Hytale créés par la communauté. Nouvelles mécaniques, outils et contenu supplémentaire pour enrichir votre expérience dans Orbis.',
			keywords: 'mods hytale, télécharger mods hytale, modding hytale, modifications hytale, addons hytale',
			ogImage: '/mods.jpeg',
			ogType: 'website'
		},
		pt: {
			title: 'Mods Hytale - Descubra e baixe | Hytale Guia',
			description: 'Explore os melhores mods do Hytale criados pela comunidade. Novas mecânicas, ferramentas e conteúdo adicional para enriquecer sua experiência em Orbis.',
			keywords: 'mods hytale, baixar mods hytale, modding hytale, modificações hytale, addons hytale',
			ogImage: '/mods.jpeg',
			ogType: 'website'
		},
		it: {
			title: 'Mod Hytale - Scopri e scarica | Hytale Guida',
			description: 'Esplora le migliori mod di Hytale create dalla comunità. Nuove meccaniche, strumenti e contenuti aggiuntivi per arricchire la tua esperienza in Orbis.',
			keywords: 'mod hytale, scaricare mod hytale, modding hytale, modifiche hytale, addon hytale',
			ogImage: '/mods.jpeg',
			ogType: 'website'
		}
	},
	'/bugs': {
		es: {
			title: 'Bugs de Hytale - Errores conocidos y soluciones | Hytale Guía',
			description: 'Listado actualizado de bugs de Hytale. Errores conocidos, número de reportes, estado, fixes y soluciones aportadas por la comunidad.',
			keywords: 'bugs hytale, errores hytale, bug tracker hytale, problemas hytale, fixes hytale',
			ogImage: '/bugs.jpg',
			ogType: 'website'
		},
		en: {
			title: 'Hytale Bugs - Known issues and fixes | Hytale Guide',
			description: 'Up-to-date list of Hytale bugs. Known issues, report counts, status, fixes and community-provided solutions.',
			keywords: 'hytale bugs, hytale issues, hytale bug tracker, hytale problems, hytale fixes',
			ogImage: '/bugs.jpg',
			ogType: 'website'
		},
		fr: {
			title: 'Bugs Hytale - Problèmes connus et solutions | Hytale Guide',
			description: 'Liste à jour des bugs de Hytale. Problèmes connus, nombre de signalements, état, correctifs et solutions de la communauté.',
			keywords: 'bugs hytale, problèmes hytale, bug tracker hytale, correctifs hytale',
			ogImage: '/bugs.jpg',
			ogType: 'website'
		},
		pt: {
			title: 'Bugs do Hytale - Problemas conhecidos e soluções | Hytale Guia',
			description: 'Lista atualizada de bugs do Hytale. Problemas conhecidos, número de relatos, status, correções e soluções da comunidade.',
			keywords: 'bugs hytale, problemas hytale, bug tracker hytale, correções hytale',
			ogImage: '/bugs.jpg',
			ogType: 'website'
		},
		it: {
			title: 'Bug di Hytale - Problemi noti e soluzioni | Hytale Guida',
			description: 'Elenco aggiornato dei bug di Hytale. Problemi noti, numero di segnalazioni, stato, fix e soluzioni della community.',
			keywords: 'bug hytale, problemi hytale, bug tracker hytale, fix hytale',
			ogImage: '/bugs.jpg',
			ogType: 'website'
		}
	},
	'/404': {
		es: {
			title: 'Página no encontrada (404) - HytaleGuía',
			description: 'La página que buscas no existe. Vuelve a HytaleGuía para explorar noticias, mods y guías de Hytale.',
			keywords: '404, página no encontrada, error, hytale',
			ogType: 'website'
		},
		en: {
			title: 'Page not found (404) - HytaleGuía',
			description: 'The page you are looking for does not exist. Go back to HytaleGuía to explore news, mods and guides.',
			keywords: '404, page not found, error, hytale',
			ogType: 'website'
		},
		fr: {
			title: 'Page introuvable (404) - HytaleGuía',
			description: 'La page que vous recherchez n\'existe pas. Retournez à HytaleGuía pour explorer les actualités, mods et guides.',
			keywords: '404, page introuvable, erreur, hytale',
			ogType: 'website'
		},
		pt: {
			title: 'Página não encontrada (404) - HytaleGuía',
			description: 'A página que você procura não existe. Volte para HytaleGuía para explorar notícias, mods e guias.',
			keywords: '404, página não encontrada, erro, hytale',
			ogType: 'website'
		},
		it: {
			title: 'Pagina non trovata (404) - HytaleGuía',
			description: 'La pagina che cerchi non esiste. Torna a HytaleGuía per esplorare notizie, mod e guide.',
			keywords: '404, pagina non trovata, errore, hytale',
			ogType: 'website'
		}
	},
	'/cookies': {
		es: {
			title: 'Política de Cookies - HytaleGuía',
			description: 'Conoce cómo usamos cookies en HytaleGuía. Información sobre cookies técnicas, analíticas y publicitarias, y cómo gestionarlas.',
			keywords: 'cookies, política de cookies, privacidad, gdpr, analytics, google adsense',
			ogType: 'website'
		},
		en: {
			title: 'Cookie Policy - HytaleGuía',
			description: 'Learn how we use cookies at HytaleGuía. Information about technical, analytics and advertising cookies, and how to manage them.',
			keywords: 'cookies, cookie policy, privacy, gdpr, analytics, google adsense',
			ogType: 'website'
		},
		fr: {
			title: 'Politique de Cookies - HytaleGuía',
			description: 'Découvrez comment nous utilisons les cookies sur HytaleGuía. Informations sur les cookies techniques, analytiques et publicitaires, et comment les gérer.',
			keywords: 'cookies, politique de cookies, confidentialité, rgpd, analytics, google adsense',
			ogType: 'website'
		},
		pt: {
			title: 'Política de Cookies - HytaleGuía',
			description: 'Saiba como usamos cookies no HytaleGuía. Informações sobre cookies técnicos, analíticos e publicitários, e como gerenciá-los.',
			keywords: 'cookies, política de cookies, privacidade, gdpr, analytics, google adsense',
			ogType: 'website'
		},
		it: {
			title: 'Politica dei Cookie - HytaleGuía',
			description: 'Scopri come utilizziamo i cookie su HytaleGuía. Informazioni sui cookie tecnici, analitici e pubblicitari, e come gestirli.',
			keywords: 'cookies, politica dei cookie, privacy, gdpr, analytics, google adsense',
			ogType: 'website'
		}
	},
	'/privacidad': {
		es: {
			title: 'Política de Privacidad - HytaleGuía',
			description: 'Política de privacidad de HytaleGuía. Conoce cómo recopilamos, usamos y protegemos tus datos personales según el RGPD.',
			keywords: 'privacidad, política de privacidad, protección de datos, rgpd, gdpr, datos personales',
			ogType: 'website'
		},
		en: {
			title: 'Privacy Policy - HytaleGuía',
			description: 'HytaleGuía privacy policy. Learn how we collect, use and protect your personal data according to GDPR.',
			keywords: 'privacy, privacy policy, data protection, gdpr, personal data',
			ogType: 'website'
		},
		fr: {
			title: 'Politique de Confidentialité - HytaleGuía',
			description: 'Politique de confidentialité de HytaleGuía. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles selon le RGPD.',
			keywords: 'confidentialité, politique de confidentialité, protection des données, rgpd, données personnelles',
			ogType: 'website'
		},
		pt: {
			title: 'Política de Privacidade - HytaleGuía',
			description: 'Política de privacidade da HytaleGuía. Saiba como coletamos, usamos e protegemos seus dados pessoais de acordo com o GDPR.',
			keywords: 'privacidade, política de privacidade, proteção de dados, gdpr, dados pessoais',
			ogType: 'website'
		},
		it: {
			title: 'Informativa sulla Privacy - HytaleGuía',
			description: 'Informativa sulla privacy di HytaleGuía. Scopri come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali secondo il GDPR.',
			keywords: 'privacy, informativa sulla privacy, protezione dei dati, gdpr, dati personali',
			ogType: 'website'
		}
	},
	'/terminos-de-uso': {
		es: {
			title: 'Términos de Uso - HytaleGuía',
			description: 'Términos y condiciones de uso de HytaleGuía. Lee las normas y condiciones para usar nuestro sitio web y servicios.',
			keywords: 'términos de uso, condiciones, términos y condiciones, legal, normas',
			ogType: 'website'
		},
		en: {
			title: 'Terms of Use - HytaleGuía',
			description: 'HytaleGuía terms and conditions of use. Read the rules and conditions for using our website and services.',
			keywords: 'terms of use, conditions, terms and conditions, legal, rules',
			ogType: 'website'
		},
		fr: {
			title: 'Conditions d\'Utilisation - HytaleGuía',
			description: 'Conditions générales d\'utilisation de HytaleGuía. Lisez les règles et conditions pour utiliser notre site web et nos services.',
			keywords: 'conditions d\'utilisation, conditions, conditions générales, légal, règles',
			ogType: 'website'
		},
		pt: {
			title: 'Termos de Uso - HytaleGuía',
			description: 'Termos e condições de uso da HytaleGuía. Leia as regras e condições para usar nosso site e serviços.',
			keywords: 'termos de uso, condições, termos e condições, legal, regras',
			ogType: 'website'
		},
		it: {
			title: 'Termini di Utilizzo - HytaleGuía',
			description: 'Termini e condizioni d\'uso di HytaleGuía. Leggi le regole e le condizioni per utilizzare il nostro sito web e i nostri servizi.',
			keywords: 'termini di utilizzo, condizioni, termini e condizioni, legale, regole',
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
