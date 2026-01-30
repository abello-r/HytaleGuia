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

const truncate = (text: string = '', max: number): string => 
	text ? (text.length <= max ? text : text.substring(0, max).trim() + '...') : 'No description available';

const SkeletonCard = () => (
	<div className="bg-white/5 border-2 border-white/10 rounded-2xl overflow-hidden animate-pulse">
		<div className="h-36 md:h-48 bg-white/10" />
		<div className="p-4 md:p-6 space-y-3">
			<div className="h-5 w-16 bg-white/10 rounded-full" />
			<div className="h-6 w-3/4 bg-white/10 rounded" />
			<div className="space-y-2">
				<div className="h-4 w-full bg-white/10 rounded" />
				<div className="h-4 w-2/3 bg-white/10 rounded" />
			</div>
			<div className="h-4 w-24 bg-white/10 rounded mt-4" />
		</div>
	</div>
);

export default function TrendingSection() {
	const { t } = useTranslation();
	const [topics, setTopics] = useState<TrendingTopic[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch('/api/trending/latest');
				if (!res.ok) throw new Error('Failed to fetch');
				const { success, data } = await res.json();
				if (!success) throw new Error('Invalid response');

				const { blogs, bugs, mods } = data;
				const items: TrendingTopic[] = [];

				if (blogs?.[0]?.output?.noticias?.[0]) {
					const n = blogs[0].output.noticias[0];
					items.push({
						id: 1,
						title: truncate(n.titulo, 60),
						description: truncate(n.resumen, 120),
						badge: 'NEWS',
						badgeColor: 'bg-[#00d2ff]',
						image: '/news_paper.jpeg',
						url: n.url
					});
				}

				if (bugs?.[0]?.bugs?.[0]) {
					const b = bugs[0].bugs[0];
					items.push({
						id: 2,
						title: truncate(b.titulo, 60),
						description: truncate(b.resumen, 120),
						badge: 'BUG',
						badgeColor: 'bg-red-500',
						image: '/bugs.jpg',
						url: b.full_link
					});
				}

				if (mods?.[0]?.mods?.[0]) {
					const m = mods[0].mods[0];
					items.push({
						id: 3,
						title: truncate(m.titulo, 60),
						description: truncate(m.resumen || m.descripcion, 120),
						badge: 'MOD',
						badgeColor: 'bg-purple-500',
						image: '/mods.jpeg',
						url: Array.isArray(m.links_descarga) ? m.links_descarga[0] : m.links_descarga,
						author: m.autor
					});
				}

				while (items.length < 4) {
					items.push({
						id: 4 + items.length - 3,
						title: 'Saturno - Hytale Server',
						description: 'Join Saturno, the premier Hytale server offering unique gameplay, active community events, and a friendly atmosphere.',
						badge: 'SERVER',
						badgeColor: 'bg-[#e5c100]',
						image: '/servers.jpeg'
					});
				}

				setTopics(items);
			} catch (err) {
				console.error('Error fetching trending:', err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	return (
		<div className="relative bg-[#0b0d12] py-12 md:py-16 pt-12 md:pt-32">
			<div className="container mx-auto px-4">
				<h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">
					{t('trending.title')} <span className="text-[#00d2ff]">{t('trending.titleHighlight')}</span>
				</h2>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto">
					{loading ? (
						[...Array(4)].map((_, i) => <SkeletonCard key={i} />)
					) : topics.length === 0 ? (
						<div className="col-span-full text-center text-gray-400">No content available</div>
					) : (
						topics.map((topic, i) => (
							<TrendingCard
								key={topic.id}
								title={topic.title}
								description={topic.description}
								badge={topic.badge}
								badgeColor={topic.badgeColor}
								image={topic.image}
								url={topic.url}
								author={topic.author}
								isLast={i === topics.length - 1}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
