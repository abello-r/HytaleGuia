import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscordButton from '../components/DiscordButton';
import ShareButton from '../components/ShareButton';

interface NewsArticle {
    titulo: string;
    resumen: string;
    fecha: string;
    fuente: string;
    url: string;
    fileDate: string;
}

// Skeleton component for loading state
function NewsSkeleton() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div className="bg-gray-700 h-6 w-16 rounded-full"></div>
                <div className="text-right space-y-2">
                    <div className="bg-gray-700 h-4 w-24 rounded ml-auto"></div>
                    <div className="bg-gray-700 h-4 w-20 rounded ml-auto"></div>
                </div>
            </div>

            <div className="bg-gray-700 h-8 w-3/4 rounded mb-3"></div>

            <div className="space-y-2 mb-4">
                <div className="bg-gray-700 h-4 w-full rounded"></div>
                <div className="bg-gray-700 h-4 w-full rounded"></div>
                <div className="bg-gray-700 h-4 w-2/3 rounded"></div>
            </div>

            <div className="bg-gray-700 h-4 w-24 rounded"></div>
        </div>
    );
}

export default function NewsPage() {
    const { t } = useTranslation();
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [displayCount, setDisplayCount] = useState(10);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute for accurate countdowns
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchAllNews() {
            try {
                const response = await fetch('/api/news/all');
                const result = await response.json();

                if (result.success) {
                    setNews(result.data.news);
                    setFilteredNews(result.data.news);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAllNews();
    }, []);

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter news based on search and sort
    useEffect(() => {
        let filtered = news;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(article =>
                article.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.resumen.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);

            if (sortBy === 'newest') {
                return dateB.getTime() - dateA.getTime();
            } else if (sortBy === 'oldest') {
                return dateA.getTime() - dateB.getTime();
            } else if (sortBy === 'source') {
                return simplifySourceName(a.fuente).localeCompare(simplifySourceName(b.fuente));
            }
            return 0;
        });

        setFilteredNews(filtered);
        setDisplayCount(10);
    }, [searchQuery, sortBy, news]);

    // Handle sort change with loading state
    const handleSortChange = (newSort: string) => {
        setSorting(true);
        setSortBy(newSort);

        // Simulate brief loading for visual feedback
        setTimeout(() => {
            setSorting(false);
        }, 300);
    };

    // Get last update time from most recent news
    const getLastUpdateTime = (): Date | null => {
        if (news.length === 0) return null;

        // Find the most recent fileDate from all news
        const dates = news.map(n => new Date(n.fileDate || n.fecha));
        return new Date(Math.max(...dates.map(d => d.getTime())));
    };

    // Calculate time ago with real-time precision
    const getTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const diffMs = currentTime.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            if (diffDays === 1) {
                return `hace ${diffDays} día`;
            }
            return `hace ${diffDays} días`;
        }

        if (diffHours > 0) {
            if (diffHours === 1) {
                return `hace ${diffHours} hora`;
            }
            return `hace ${diffHours} horas`;
        }

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        if (diffMinutes === 1) return 'hace 1 minuto';
        if (diffMinutes > 0) return `hace ${diffMinutes} minutos`;

        return 'hace unos segundos';
    };

    // Calculate next refresh based on cron: 0 9,12,18 * * * (9am, 12pm, 6pm)
    const getNextRefresh = (): string => {
        const now = currentTime;
        const hours = now.getHours();

        let nextHour: number;
        if (hours < 9) {
            nextHour = 9;
        } else if (hours < 12) {
            nextHour = 12;
        } else if (hours < 18) {
            nextHour = 18;
        } else {
            // After 6pm, next update is tomorrow at 9am
            nextHour = 9 + 24;
        }

        const next = new Date(now);
        next.setHours(nextHour % 24);
        next.setMinutes(0);
        next.setSeconds(0);

        if (nextHour >= 24) {
            next.setDate(next.getDate() + 1);
        }

        const diffMs = next.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours === 0) {
            if (diffMinutes === 1) return t('news.timeIn.minute');
            return t('news.timeIn.minutes', { count: diffMinutes });
        }

        if (diffMinutes === 0) {
            if (diffHours === 1) return t('news.timeIn.hour');
            return t('news.timeIn.hours', { count: diffHours });
        }

        if (diffHours === 1) {
            return t('news.timeIn.hourAndMinutes', { minutes: diffMinutes });
        }
        return t('news.timeIn.hoursAndMinutes', { hours: diffHours, minutes: diffMinutes });
    };

    // Simplify source names
    const simplifySourceName = (source: string): string => {
        const sourceMap: { [key: string]: string } = {
            'vandal.elespanol.com': 'Vandal',
            'amp.marca.com': 'Marca',
            'infobae.com': 'Infobae',
            'Meristation (AS)': 'Meristation',
            'Meristation': 'Meristation',
            'GamesRadar': 'GamesRadar',
            'PC Gamer': 'PC Gamer',
            'Windows Central': 'Windows Central'
        };
        return sourceMap[source] || source;
    };

    // Format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Check if news is new (within 24 hours)
    const isNew = (dateString: string): boolean => {
        const articleDate = new Date(dateString);
        const diffTime = Math.abs(currentTime.getTime() - articleDate.getTime());
        const diffHours = diffTime / (1000 * 60 * 60);
        return diffHours <= 24;
    };

    // Get icon for source
    const getSourceIcon = (source: string): string => {
        const icons: { [key: string]: string } = {
            'Vandal': '🎮',
            'Marca': '⚽',
            'Infobae': '📰',
            'Meristation': '🎯',
            'GamesRadar': '🎮',
            'PC Gamer': '💻',
            'Windows Central': '🪟'
        };
        return icons[source] || '📰';
    };

    // Get featured article (most recent)
    const featuredArticle = filteredNews[0];

    // Highlight search text
    const highlightText = (text: string, query: string) => {
        if (!query) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase()
                ? <mark key={index} className="bg-yellow-400 text-[#0b0d12] px-1 rounded">{part}</mark>
                : part
        );
    };

    // Group news by date
    const groupByDate = (articles: NewsArticle[]) => {
        const grouped: { [key: string]: NewsArticle[] } = {};

        articles.forEach(article => {
            const date = formatDate(article.fecha);
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(article);
        });

        return grouped;
    };

    const loadMore = () => {
        setDisplayCount(prev => prev + 10);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const groupedNews = groupByDate(filteredNews.slice(1, displayCount)); // Skip first (featured)

    const lastUpdate = getLastUpdateTime();

    return (
        <div className="min-h-screen bg-[#0b0d12] flex flex-col">
            <Header />
            <DiscordButton />

            <main className="flex-1 container mx-auto px-4 py-24">
                {/* Breadcrumbs */}
                <div className="max-w-5xl mx-auto mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <a href="/" className="hover:text-[#00d2ff] transition">{t('news.breadcrumbs.home')}</a>
                        <span>›</span>
                        <span className="text-white">{t('news.breadcrumbs.news')}</span>
                    </div>
                </div>

                {/* Page Header */}
                <div className="max-w-5xl mx-auto mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        {t('news.title')} <span className="text-[#00d2ff]">{t('news.titleHighlight')}</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-4">
                        {t('news.description')}
                    </p>

                    {/* Status badges */}
                    {!loading && (
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] px-4 py-2 rounded-full text-sm font-medium">
                                <span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
                                <span>{news.length} {t('news.available')}</span>
                            </div>

                            {lastUpdate && (
                                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                                    <span>✓</span>
                                    <span>{t('news.lastUpdate')}: {getTimeAgo(lastUpdate.toISOString())}</span>
                                </div>
                            )}

                            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
                                <span>⏰</span>
                                <span>{t('news.nextUpdate')}: {getNextRefresh()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    // Loading skeleton
                    <div className="max-w-5xl mx-auto">
                        {/* Skeleton filters */}
                        <div className="mb-8 space-y-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl h-14 animate-pulse"></div>
                            <div className="flex gap-3">
                                <div className="bg-white/5 h-10 w-32 rounded-lg animate-pulse"></div>
                                <div className="bg-white/5 h-10 w-40 rounded-lg animate-pulse"></div>
                                <div className="bg-white/5 h-10 w-36 rounded-lg animate-pulse"></div>
                            </div>
                        </div>

                        {/* Skeleton news cards */}
                        <div className="space-y-6">
                            {[...Array(5)].map((_, index) => (
                                <NewsSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Filters */}
                        <div className="max-w-5xl mx-auto mb-8 space-y-4">
                            {/* Search bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('news.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>

                                {/* Goblin sitting on search bar */}
                                <img
                                    src="/News.png"
                                    alt="Goblin reading news"
                                    className="absolute -top-25 right-4 w-32 h-auto z-20 pointer-events-none select-none"
                                />
                            </div>

                            {/* Sort by */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-gray-400 text-sm font-medium">{t('news.sortBy')}:</span>
                                <button
                                    onClick={() => handleSortChange('newest')}
                                    disabled={sorting}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${sortBy === 'newest'
                                            ? 'bg-[#00d2ff] text-[#0b0d12]'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        } ${sorting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {t('news.sortOptions.newest')}
                                </button>
                                <button
                                    onClick={() => handleSortChange('oldest')}
                                    disabled={sorting}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${sortBy === 'oldest'
                                            ? 'bg-[#00d2ff] text-[#0b0d12]'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        } ${sorting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {t('news.sortOptions.oldest')}
                                </button>
                                <button
                                    onClick={() => handleSortChange('source')}
                                    disabled={sorting}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${sortBy === 'source'
                                            ? 'bg-[#00d2ff] text-[#0b0d12]'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        } ${sorting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {t('news.sortOptions.source')}
                                </button>

                                {/* Sorting indicator */}
                                {sorting && (
                                    <span className="inline-flex items-center gap-2 text-[#00d2ff] text-sm">
                                        <span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
                                        {t('news.sorting')}
                                    </span>
                                )}
                            </div>

                            {/* Results count */}
                            <div className="text-gray-400 text-sm">
                                {t('news.showing')} {Math.min(displayCount, filteredNews.length)} {t('news.of')} {filteredNews.length} {t('news.results')}
                            </div>
                        </div>

                        {/* News List */}
                        {sorting ? (
                            // Sorting skeleton
                            <div className="max-w-5xl mx-auto space-y-6">
                                {[...Array(3)].map((_, index) => (
                                    <NewsSkeleton key={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="max-w-5xl mx-auto space-y-8">
                                {filteredNews.length === 0 ? (
                                    <div className="text-center text-gray-400 py-12">
                                        {t('news.noResults')}
                                    </div>
                                ) : (
                                    <>
                                        {/* Featured Article - Noticia del día */}
                                        {featuredArticle && (
                                            <div
                                                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 cursor-pointer group overflow-hidden animate-fadeIn hover:border-[#00d2ff]/50 hover:bg-white/[0.07] transition-all duration-300"
                                                onClick={() => window.open(featuredArticle.url, '_blank')}
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
                                                                <span>⭐</span> {t('news.featured')}
                                                            </span>
                                                            {isNew(featuredArticle.fecha) && (
                                                                <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                                                                    {t('news.new')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[#00d2ff] font-medium flex items-center gap-1.5 justify-end text-sm">
                                                                <span className="text-xs">{getSourceIcon(simplifySourceName(featuredArticle.fuente))}</span>
                                                                {simplifySourceName(featuredArticle.fuente)}
                                                            </div>
                                                            <div className="text-gray-400 text-xs mt-1">{formatDate(featuredArticle.fecha)}</div>
                                                        </div>
                                                    </div>

                                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-[#00d2ff] transition leading-tight">
                                                        {highlightText(featuredArticle.titulo, searchQuery)}
                                                    </h2>

                                                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                                        {highlightText(featuredArticle.resumen, searchQuery)}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center text-[#00d2ff] font-bold group-hover:text-white transition">
                                                            <span>{t('news.readFull')}</span>
                                                            <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                                                        </div>
                                                        <ShareButton
                                                            title={featuredArticle.titulo}
                                                            text={featuredArticle.resumen}
                                                            url={featuredArticle.url}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Regular news grouped by date */}
                                        {Object.entries(groupedNews).map(([date, articles]) => (
                                            <div key={date}>
                                                {/* Date separator */}
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="flex-1 h-px bg-white/10"></div>
                                                    <span className="text-gray-400 text-sm font-medium px-4 py-1.5 bg-white/5 rounded-full">
                                                        {date}
                                                    </span>
                                                    <div className="flex-1 h-px bg-white/10"></div>
                                                </div>

                                                {/* Articles for this date */}
                                                <div className="space-y-6">
                                                    {articles.map((article, index) => (
                                                        <article
                                                            key={index}
                                                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] transition-all duration-300 group cursor-pointer animate-fadeIn"
                                                            style={{ animationDelay: `${index * 50}ms` }}
                                                            onClick={() => window.open(article.url, '_blank')}
                                                        >
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="bg-[#00d2ff] text-[#0b0d12] text-xs font-bold px-3 py-1 rounded-full">
                                                                        {t('news.badge')}
                                                                    </span>
                                                                    {isNew(article.fecha) && (
                                                                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                                                            {t('news.new')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-right text-sm">
                                                                    <div className="text-[#00d2ff] font-medium flex items-center gap-1.5 justify-end">
                                                                        <span className="text-xs">{getSourceIcon(simplifySourceName(article.fuente))}</span>
                                                                        {simplifySourceName(article.fuente)}
                                                                    </div>
                                                                    <div className="text-gray-400 text-xs mt-1">{formatDate(article.fecha)}</div>
                                                                </div>
                                                            </div>

                                                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00d2ff] transition">
                                                                {highlightText(article.titulo, searchQuery)}
                                                            </h2>

                                                            <p className="text-gray-400 mb-4 line-clamp-3">
                                                                {highlightText(article.resumen, searchQuery)}
                                                            </p>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center text-[#00d2ff] font-medium text-sm group-hover:text-[#e5c100] transition">
                                                                    <span>{t('news.readMore')}</span>
                                                                    <span className="ml-2">→</span>
                                                                </div>
                                                                <ShareButton
                                                                    title={article.titulo}
                                                                    text={article.resumen}
                                                                    url={article.url}
                                                                />
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Load More Button */}
                                        {displayCount < filteredNews.length && (
                                            <div className="text-center py-8">
                                                <button
                                                    onClick={loadMore}
                                                    className="bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] font-bold px-8 py-3 rounded-xl transition"
                                                >
                                                    {t('news.loadMore')}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Scroll to top button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
                    aria-label={t('news.scrollTop')}
                >
                    <span className="text-2xl">↑</span>
                </button>
            )}

            <Footer />
        </div>
    );
}