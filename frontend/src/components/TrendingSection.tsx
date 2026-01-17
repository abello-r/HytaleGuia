import { useTranslation } from 'react-i18next';
import TrendingCard from './TrendingCard';

export default function TrendingSection() {
	const { t } = useTranslation();

	const trendingTopics = [
		{
			id: 1,
			title: 'Actualización de Verano',
			description: 'Nuevos biomas actualizados y mecánicas de buceo reveladas.',
			badge: 'NOTICIA',
			badgeColor: 'bg-[#00d2ff]',
			image: '🏝️'
		},
		{
			id: 2,
			title: 'Maestría en Forja',
			description: 'Cómo crear armaduras de Void metal paso a paso.',
			badge: 'GUÍA',
			badgeColor: 'bg-[#00d2ff]',
			image: '⚔️'
		},
		{
			id: 3,
			title: 'Orbis Legends: RPG',
			description: 'Servidor número 1 en habla hispana. Economía y PvP.',
			badge: 'SERVIDOR',
			badgeColor: 'bg-[#00d2ff]',
			image: '🎮'
		},
		{
			id: 4,
			title: 'Guía de Mods',
			description: 'Los mejores mods para mejorar tu experiencia en Hytale.',
			badge: 'MODS',
			badgeColor: 'bg-[#00d2ff]',
			image: '🔧'
		}
	];

	return (
		<div className="relative bg-[#0b0d12] py-16">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-center space-x-3 mb-12">
					<h2 className="text-4xl font-bold text-white">
						{t('trending.title')} <span className="text-[#00d2ff]">{t('trending.titleHighlight')}</span>
					</h2>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
					{trendingTopics.map((topic) => (
						<TrendingCard
							key={topic.id}
							title={topic.title}
							description={topic.description}
							badge={topic.badge}
							badgeColor={topic.badgeColor}
							image={topic.image}
						/>
					))}
				</div>
			</div>
		</div>
	);
}