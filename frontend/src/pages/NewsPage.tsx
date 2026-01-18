import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface NewsArticle {
  titulo: string;
  resumen: string;
  fecha: string;
  fuente: string;
  url: string;
  fileDate: string;
}

export default function NewsPage() {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [displayCount, setDisplayCount] = useState(10);

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

  // Filter news based on search and source
  useEffect(() => {
    let filtered = news;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.resumen.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by source
    if (selectedSource !== 'all') {
      filtered = filtered.filter(article => article.fuente === selectedSource);
    }

    setFilteredNews(filtered);
    setDisplayCount(10); // Reset display count when filters change
  }, [searchQuery, selectedSource, news]);

  // Get unique sources
  const sources = ['all', ...new Set(news.map(article => article.fuente))];

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

  const loadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center">
        <div className="text-white text-xl">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        {/* Page Header */}
        <div className="max-w-5xl mx-auto mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            {t('news.title')} <span className="text-[#00d2ff]">{t('news.titleHighlight')}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {t('news.description')}
          </p>
        </div>

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
          </div>

          {/* Source filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 text-sm font-medium">{t('news.filterBySource')}:</span>
            {sources.map(source => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedSource === source
                    ? 'bg-[#00d2ff] text-[#0b0d12]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {source === 'all' ? t('news.allSources') : source}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="text-gray-400 text-sm">
            {t('news.showing')} {Math.min(displayCount, filteredNews.length)} {t('news.of')} {filteredNews.length} {t('news.results')}
          </div>
        </div>

        {/* News List */}
        <div className="max-w-5xl mx-auto space-y-6">
          {filteredNews.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              {t('news.noResults')}
            </div>
          ) : (
            <>
              {filteredNews.slice(0, displayCount).map((article, index) => (
                <article
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] transition-all duration-300 group cursor-pointer"
                  onClick={() => window.open(article.url, '_blank')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-[#00d2ff] text-[#0b0d12] text-xs font-bold px-3 py-1 rounded-full">
                      NEWS
                    </span>
                    <div className="text-right text-sm text-gray-400">
                      <div>{formatDate(article.fecha)}</div>
                      <div className="text-[#00d2ff]">{article.fuente}</div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00d2ff] transition">
                    {article.titulo}
                  </h2>

                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {article.resumen}
                  </p>

                  <div className="flex items-center text-[#00d2ff] font-medium text-sm group-hover:text-[#e5c100] transition">
                    <span>{t('news.readMore')}</span>
                    <span className="ml-2">→</span>
                  </div>
                </article>
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
      </main>

      <Footer />
    </div>
  );
}