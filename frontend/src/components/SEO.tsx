import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
	title: string;
	description: string;
	keywords: string;
	ogImage?: string;
	canonical?: string;
	ogType?: string;
}

const LANGUAGE_META: { [key: string]: { name: string; locale: string } } = {
	es: { name: 'Spanish', locale: 'es_ES' },
	en: { name: 'English', locale: 'en_US' },
	fr: { name: 'French', locale: 'fr_FR' },
	pt: { name: 'Portuguese', locale: 'pt_PT' },
	it: { name: 'Italian', locale: 'it_IT' }
};

export default function SEO({
	title,
	description,
	keywords,
	ogImage,
	canonical,
	ogType = 'website'
}: SEOProps) {
	const { i18n } = useTranslation();
	const currentLang = i18n.language || 'es';
	const langMeta = LANGUAGE_META[currentLang] || LANGUAGE_META.es;

	useEffect(() => {
		document.documentElement.lang = currentLang;
		document.title = title;

		const updateMetaTag = (selector: string, attribute: string, content: string) => {
			let element = document.querySelector(selector);
			if (!element) {
				element = document.createElement('meta');
				if (attribute === 'property') {
					element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
				} else {
					element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
				}
				document.head.appendChild(element);
			}
			element.setAttribute('content', content);
		};

		const updateLinkTag = (rel: string, href: string, hreflang?: string) => {
			const selector = hreflang
				? `link[rel="${rel}"][hreflang="${hreflang}"]`
				: `link[rel="${rel}"]`;

			let element = document.querySelector(selector) as HTMLLinkElement;
			if (!element) {
				element = document.createElement('link');
				element.rel = rel;
				if (hreflang) element.hreflang = hreflang;
				document.head.appendChild(element);
			}
			element.href = href;
		};

		updateMetaTag('meta[name="description"]', 'name', description);
		updateMetaTag('meta[name="keywords"]', 'name', keywords);
		updateMetaTag('meta[name="language"]', 'name', langMeta.name);

		updateMetaTag('meta[property="og:type"]', 'property', ogType);
		updateMetaTag('meta[property="og:title"]', 'property', title);
		updateMetaTag('meta[property="og:description"]', 'property', description);
		updateMetaTag('meta[property="og:locale"]', 'property', langMeta.locale);
		updateMetaTag('meta[property="og:site_name"]', 'property', 'HytaleGuía');

		if (ogImage) {
			updateMetaTag('meta[property="og:image"]', 'property', `https://hytaleguia.com${ogImage}`);
			updateMetaTag('meta[name="twitter:image"]', 'name', `https://hytaleguia.com${ogImage}`);
		}

		if (canonical) {
			updateMetaTag('meta[property="og:url"]', 'property', canonical);
			updateLinkTag('canonical', canonical);

			const baseUrl = canonical.replace(/\/(en|fr|pt|it)\//, '/').replace(/\/$/, '');
			updateLinkTag('alternate', baseUrl, 'es');
			updateLinkTag('alternate', `${baseUrl}/en`, 'en');
			updateLinkTag('alternate', `${baseUrl}/fr`, 'fr');
			updateLinkTag('alternate', `${baseUrl}/pt`, 'pt');
			updateLinkTag('alternate', `${baseUrl}/it`, 'it');
			updateLinkTag('alternate', baseUrl, 'x-default');
		}

		updateMetaTag('meta[name="twitter:card"]', 'name', 'summary_large_image');
		updateMetaTag('meta[name="twitter:title"]', 'name', title);
		updateMetaTag('meta[name="twitter:description"]', 'name', description);
	}, [title, description, keywords, ogImage, canonical, ogType, currentLang, langMeta]);

	return null;
}
