interface StructuredDataProps {
	type: 'WebSite' | 'Article' | 'BreadcrumbList' | 'Organization';
	data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
	const getStructuredData = () => {
		const baseContext = "https://schema.org";

		switch (type) {
			case 'WebSite':
				return {
					"@context": baseContext,
					"@type": "WebSite",
					"name": "HytaleGuía",
					"url": "https://hytaleguia.com",
					"description": "La guía definitiva para Hytale en español",
					"potentialAction": {
						"@type": "SearchAction",
						"target": "https://hytaleguia.com/search?q={search_term_string}",
						"query-input": "required name=search_term_string"
					}
				};

			case 'Organization':
				return {
					"@context": baseContext,
					"@type": "Organization",
					"name": "HytaleGuía",
					"url": "https://hytaleguia.com",
					"logo": "https://hytaleguia.com/logo-512.png",
					"sameAs": [
						"https://twitter.com/hytaleguia",
						"https://discord.gg/hytaleguia"
					]
				};

			case 'Article':
				return {
					"@context": baseContext,
					"@type": "NewsArticle",
					"headline": data.headline,
					"description": data.description,
					"image": data.image,
					"datePublished": data.datePublished,
					"dateModified": data.dateModified || data.datePublished,
					"author": {
						"@type": "Organization",
						"name": data.author || "HytaleGuía"
					},
					"publisher": {
						"@type": "Organization",
						"name": "HytaleGuía",
						"logo": {
							"@type": "ImageObject",
							"url": "https://hytaleguia.com/logo-512.png"
						}
					},
					"mainEntityOfPage": {
						"@type": "WebPage",
						"@id": data.url
					}
				};

			case 'BreadcrumbList':
				return {
					"@context": baseContext,
					"@type": "BreadcrumbList",
					"itemListElement": data.items.map((item: any, index: number) => ({
						"@type": "ListItem",
						"position": index + 1,
						"name": item.name,
						"item": item.url
					}))
				};

			default:
				return null;
		}
	};

	const structuredData = getStructuredData();

	if (!structuredData) return null;

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}