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

function truncateText(text: string = '', maxLength: number): string {
	if (!text) return 'No description available';
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

				if (!result.success) {
					throw new Error(result.message || 'Invalid response');
				}

				const { blogs, bugs, mods } = result.data;
				const topics: TrendingTopic[] = [];

				if (blogs && Array.isArray(blogs) && blogs.length > 0 && blogs[0]?.output?.noticias?.length > 0) {
					const noticia = blogs[0].output.noticias[0];
					topics.push({
						id: 1,
						title: truncateText(noticia.titulo, 60),
						description: truncateText(noticia.resumen, 120),
						badge: 'NEWS',
						badgeColor: 'bg-[#00d2ff]',
						image: '/news_paper.jpeg',
						url: noticia.url
					});
				}

				if (bugs && Array.isArray(bugs) && bugs.length > 0 && bugs[0]?.bugs?.length > 0) {
					const bug = bugs[0].bugs[0];
					topics.push({
						id: 2,
						title: truncateText(bug.titulo, 60),
						description: truncateText(bug.resumen, 120),
						badge: 'BUG',
						badgeColor: 'bg-red-500',
						image: '/bugs.jpg',
						url: bug.full_link
					});
				}

				if (mods && Array.isArray(mods) && mods.length > 0 && mods[0]?.mods?.length > 0) {
					const mod = mods[0].mods[0];
					const downloadUrl = Array.isArray(mod.links_descarga) 
						? mod.links_descarga[0] 
						: mod.links_descarga;
					
					topics.push({
						id: 3,
						title: truncateText(mod.titulo, 60),
						description: truncateText(mod.resumen || mod.descripcion, 120),
						badge: 'MOD',
						badgeColor: 'bg-purple-500',
						image: '/mods.jpeg',
						url: downloadUrl,
						author: mod.autor
					});
				}

				while (topics.length < 4) {
					topics.push({
						id: 4 + topics.length - 3,
						title: "Saturno - Hytale Server",
						description: "Join Saturno, the premier Hytale server offering unique gameplay, active community events, and a friendly atmosphere. Dive into an unforgettable Hytale experience today!",
						badge: 'SERVER',
						badgeColor: 'bg-[#e5c100]',
						image: '/servers.jpeg'
					});
				}

				setTrendingTopics(topics);
			} catch (err) {
				console.error('Error fetching trending data:', err);
			} finally {
				setLoading(false);
			}
		}

		fetchTrendingData();
	}, []);

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
						No content available
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