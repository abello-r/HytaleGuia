import { useLatestHytalePost } from '../hooks/useHytaleAPI';
import { useTranslation } from 'react-i18next';

export default function OfficialNewsSection() {
	const { post, loading } = useLatestHytalePost();
	const { t } = useTranslation();

	if (loading || !post) {
		return null;
	}

	const getTimeAgo = (dateString: string): string => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return t('officialBlog.today');
		if (diffDays === 1) return t('officialBlog.yesterday');
		if (diffDays < 7) return t('officialBlog.daysAgo', { count: diffDays });
		if (diffDays < 30) return t('officialBlog.weeksAgo', { count: Math.floor(diffDays / 7) });
		if (diffDays < 365) return t('officialBlog.monthsAgo', { count: Math.floor(diffDays / 30) });
		return t('officialBlog.yearsAgo', { count: Math.floor(diffDays / 365) });
	};

	const getBlogUrl = (slug: string, date: string): string => {
		const postDate = new Date(date);
		const year = postDate.getFullYear();
		const month = postDate.getMonth() + 1;
		return `https://hytale.com/news/${year}/${month}/${slug}`;
	};

	return (
		<section className="py-12 px-4 relative">
			<div className="container mx-auto max-w-5xl">
				<div className="flex items-center justify-center gap-3 mb-6">
					<div className="h-px bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent flex-1"></div>
					<div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 backdrop-blur-sm border border-[#00d2ff]/30 text-[#00d2ff] px-4 py-2 rounded-full text-sm font-bold">
						<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
						<span>{t('officialBlog.sectionTitle')}</span>
					</div>
					<div className="h-px bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent flex-1"></div>
				</div>

				<article 
					className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#00d2ff]/50 hover:shadow-[0_0_40px_rgba(0,210,255,0.2)] transition-all duration-300 group cursor-pointer"
					onClick={() => window.open(getBlogUrl(post.slug, post.date), '_blank')}
				>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="relative aspect-video md:aspect-auto overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
							{post.coverImage ? (
								<img 
									src={post.coverImage} 
									alt={post.title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									onError={(e) => {
										e.currentTarget.style.display = 'none';
									}}
								/>
							) : (
								<div className="flex items-center justify-center h-full">
									<div className="text-center text-gray-500">
										<svg className="w-16 h-16 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
											<circle cx="8.5" cy="8.5" r="1.5"/>
											<polyline points="21 15 16 10 5 21"/>
										</svg>
										<p className="text-sm">Hytale</p>
									</div>
								</div>
							)}
							
							<div className="absolute top-4 right-4">
								<span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
									{getTimeAgo(post.date)}
								</span>
							</div>
						</div>

						<div className="p-6 md:p-8 flex flex-col justify-center">
							<div className="inline-flex items-center gap-2 text-xs font-bold text-[#00d2ff] mb-3 w-fit">
								<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
									<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
								</svg>
								<span>{t('officialBlog.officialNews')}</span>
							</div>

							<h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#00d2ff] transition line-clamp-2">
								{post.title}
							</h3>

							{post.excerpt && (
								<p className="text-gray-400 mb-6 line-clamp-3">
									{post.excerpt}
								</p>
							)}

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-sm text-gray-400">
									<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
										<circle cx="12" cy="7" r="4"/>
									</svg>
									<span>{post.author.name}</span>
								</div>

								<div className="flex items-center gap-2 text-[#00d2ff] font-bold group-hover:gap-3 transition-all">
									<span>{t('officialBlog.readMore')}</span>
									<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<line x1="5" y1="12" x2="19" y2="12"/>
										<polyline points="12 5 19 12 12 19"/>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</article>
			</div>
		</section>
	);
}
