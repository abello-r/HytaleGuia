interface SEOProps {
	title: string;
	description: string;
	keywords: string;
	ogImage?: string;
	canonical?: string;
	ogType?: string;
}

export default function SEO({ 
	title, 
	description, 
	keywords, 
	ogImage, 
	canonical,
	ogType = 'website'
}: SEOProps) {
	return (
		<>
			{/* Title */}
			<title>{title}</title>

			{/* Basic Meta Tags */}
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="robots" content="index, follow" />
			<meta name="language" content="Spanish" />
			<meta name="author" content="HytaleGuía" />

			{/* Canonical URL */}
			{canonical && <link rel="canonical" href={canonical} />}

			{/* Open Graph / Facebook */}
			<meta property="og:type" content={ogType} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:site_name" content="HytaleGuía" />
			<meta property="og:locale" content="es_ES" />
			{ogImage && <meta property="og:image" content={ogImage} />}
			{canonical && <meta property="og:url" content={canonical} />}

			{/* Twitter Card */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			{ogImage && <meta name="twitter:image" content={ogImage} />}

			{/* PWA Meta Tags */}
			<meta name="theme-color" content="#00d2ff" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
		</>
	);
}
