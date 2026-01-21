import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import TrendingCard from './TrendingCard';

interface TrendingTopic {
	id: number;
	title: string;
	description: string;
	badge: string;
	badgeColor: string;
	image: string;
	url?: string;
	author?: string;
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength).trim() + '...';
}

export default function TrendingSection() {
	const { t } = useTranslation();
	const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchTrendingData() {
			try {
				const response = await fetch('/api/trending/latest');

				if (!response.ok) {
					throw new Error('Failed to fetch trending data');
				}

				const result = await response.json();
				console.log('📊 Raw API response:', result);

				if (!result.success) {
					throw new Error(result.message || 'Invalid response');
				}

				const { blogs, bugs, mods } = result.data;
				console.log('📦 Data received:', { 
					blogsLength: blogs?.length, 
					bugsLength: bugs?.length, 
					modsLength: mods?.length 
				});
				
				const topics: TrendingTopic[] = [];

				// Process blogs (first one)
				if (blogs && Array.isArray(blogs) && blogs.length > 0) {
					const firstBlog = blogs[0];
					console.log('📰 Blog structure:', Object.keys(firstBlog));
					console.log('📰 Full blog data:', firstBlog);
					
					// Try different possible structures
					let noticia = null;
					
					// Structure 1: firstBlog.output.noticias[]
					if (firstBlog.output && firstBlog.output.noticias && firstBlog.output.noticias.length > 0) {
						noticia = firstBlog.output.noticias[0];
					}
					// Structure 2: firstBlog["0"].output.noticias[] (string index)
					else if (firstBlog["0"] && firstBlog["0"].output && firstBlog["0"].output.noticias) {
						noticia = firstBlog["0"].output.noticias[0];
					}
					// Structure 3: Direct array access
					else if (Array.isArray(firstBlog) && firstBlog.length > 0) {
						const item = firstBlog[0];
						if (item.output && item.output.noticias) {
							noticia = item.output.noticias[0];
						}
					}
					
					if (noticia) {
						console.log('✅ News found:', noticia.titulo);
						topics.push({
							id: 1,
							title: truncateText(noticia.titulo || 'News', 60),
							description: truncateText(noticia.resumen || 'No description available', 120),
							badge: 'NEWS',
							badgeColor: 'bg-[#00d2ff]',
							image: '/news_paper.jpeg',
							url: noticia.url
						});
					} else {
						console.warn('⚠️ Blog structure incorrect. Expected: firstBlog.output.noticias[]');
						console.warn('Got:', firstBlog);
					}
				} else {
					console.warn('⚠️ No blogs data or empty array');
				}

				// Process bugs (first one)
				if (bugs && Array.isArray(bugs) && bugs.length > 0) {
					const firstBug = bugs[0];
					console.log('🐛 Bug structure:', Object.keys(firstBug));
					
					if (firstBug.output && firstBug.output.bugs && firstBug.output.bugs.length > 0) {
						const bugReport = firstBug.output.bugs[0];
						console.log('✅ Bug found:', bugReport.titulo);
						topics.push({
							id: 2,
							title: truncateText(bugReport.titulo || 'Bug Report', 60),
							description: truncateText(bugReport.resumen || 'No description available', 120),
							badge: 'BUG',
							badgeColor: 'bg-red-500',
							image: '/bugs.jpg',
							url: bugReport.url
						});
					} else {
						console.warn('⚠️ Bug structure incorrect. Expected: firstBug.output.bugs[]');
						console.warn('Got:', firstBug);
					}
				} else {
					console.warn('⚠️ No bugs data or empty array');
				}

				// Process mods (first one) - Different structure
				if (mods && Array.isArray(mods) && mods.length > 0) {
					const firstModData = mods[0];
					console.log('🎮 Mod structure:', Object.keys(firstModData));
					console.log('🎮 Full mod data:', firstModData);
					
					// Try different possible structures
					let modInfo = null;
					
					// Structure 1: firstModData.mods[]
					if (firstModData.mods && Array.isArray(firstModData.mods) && firstModData.mods.length > 0) {
						modInfo = firstModData.mods[0];
					}
					// Structure 2: firstModData["0"].mods[] (string index)
					else if (firstModData["0"] && firstModData["0"].mods && Array.isArray(firstModData["0"].mods)) {
						modInfo = firstModData["0"].mods[0];
					}
					// Structure 3: Direct array access
					else if (Array.isArray(firstModData) && firstModData.length > 0) {
						const item = firstModData[0];
						if (item.mods && Array.isArray(item.mods)) {
							modInfo = item.mods[0];
						}
					}
					
					if (modInfo) {
						console.log('✅ Mod found:', modInfo.titulo);
						topics.push({
							id: 3,
							title: truncateText(modInfo.titulo || 'Mod', 60),
							description: truncateText(modInfo.resumen || modInfo.descripcion || 'No description available', 120),
							badge: 'MOD',
							badgeColor: 'bg-purple-500',
							image: '/mods.jpeg',
							url: modInfo.links_descarga?.[0] || '',
							author: modInfo.autor
						});
					} else {
						console.warn('⚠️ Mod structure incorrect. Expected: firstModData.mods[]');
						console.warn('Got:', firstModData);
					}
				} else {
					console.warn('⚠️ No mods data or empty array');
				}

				// Add SERVER card if we have less than 4 items
				if (topics.length < 4) {
					console.log('➕ Adding SERVER card (total topics:', topics.length, ')');
					topics.push({
						id: 4,
						title: "Saturno - Hytale Server",
						description: "Join Saturno, the premier Hytale server offering unique gameplay, active community events, and a friendly atmosphere. Dive into an unforgettable Hytale experience today!",
						badge: 'SERVER',
						badgeColor: 'bg-[#e5c100]',
						image: '/servers.jpeg'
					});
				}

				console.log('🎯 Final topics count:', topics.length);
				console.log('🎯 Topics:', topics.map(t => ({ id: t.id, badge: t.badge, title: t.title })));
				setTrendingTopics(topics);

			} catch (err) {
				console.error('❌ Error fetching trending data:', err);
			} finally {
				setLoading(false);
			}
		}

		fetchTrendingData();
	}, [t]);

	if (loading) {
		return (
			<div className="relative bg-[#0b0d12] py-16 pt-32">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-center">
						<div className="text-white">
							<div className="animate-pulse flex space-x-4">
								<div className="flex-1 space-y-4 py-1">
									<div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
									<div className="space-y-2">
										<div className="h-4 bg-gray-700 rounded"></div>
										<div className="h-4 bg-gray-700 rounded w-5/6 mx-auto"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (trendingTopics.length === 0) {
		return (
			<div className="relative bg-[#0b0d12] py-16 pt-32">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-center space-x-3 mb-12">
						<h2 className="text-4xl font-bold text-white">
							{t('trending.title')} <span className="text-[#00d2ff]">{t('trending.titleHighlight')}</span>
						</h2>
					</div>
					<div className="text-center text-gray-400">
						{t('trending.noContent')}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative bg-[#0b0d12] py-16 pt-32">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-center space-x-3 mb-12">
					<h2 className="text-4xl font-bold text-white">
						{t('trending.title')} <span className="text-[#00d2ff]">{t('trending.titleHighlight')}</span>
					</h2>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
					{trendingTopics.map((topic, index) => (
						<TrendingCard
							key={topic.id}
							title={topic.title}
							description={topic.description}
							badge={topic.badge}
							badgeColor={topic.badgeColor}
							image={topic.image}
							url={topic.url}
							author={topic.author}
							isLast={index === trendingTopics.length - 1}
						/>
					))}
				</div>
			</div>
		</div>
	);
}