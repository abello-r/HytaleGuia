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
  date?: string;
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
        
        if (!result.success) {
          throw new Error(result.message || 'Invalid response');
        }

        const { blogs, bugs, mods } = result.data;
        const topics: TrendingTopic[] = [];

        // Process blogs (first one)
        if (blogs && Array.isArray(blogs) && blogs.length > 0) {
          const firstBlog = blogs[0];
          if (firstBlog.output && firstBlog.output.noticias && firstBlog.output.noticias.length > 0) {
            const noticia = firstBlog.output.noticias[0];
            topics.push({
              id: 1,
              title: truncateText(noticia.titulo || 'News', 60),
              description: truncateText(noticia.resumen || 'No description available', 120),
              badge: 'NEWS',
              badgeColor: 'bg-[#00d2ff]',
              image: '📰',
              url: noticia.url,
              date: noticia.fecha
            });
          }
        }

        // Process bugs (first one)
        if (bugs && Array.isArray(bugs) && bugs.length > 0) {
          const firstBug = bugs[0];
          if (firstBug.output && firstBug.output.noticias && firstBug.output.noticias.length > 0) {
            const bugReport = firstBug.output.noticias[0];
            topics.push({
              id: 2,
              title: truncateText(bugReport.titulo || 'Bug Report', 60),
              description: truncateText(bugReport.resumen || 'No description available', 120),
              badge: 'BUG',
              badgeColor: 'bg-red-500',
              image: '🐛',
              url: bugReport.url,
              date: bugReport.fecha
            });
          }
        }

        // Process mods (first one)
        if (mods && Array.isArray(mods) && mods.length > 0) {
          const firstMod = mods[0];
          if (firstMod.output && firstMod.output.noticias && firstMod.output.noticias.length > 0) {
            const modInfo = firstMod.output.noticias[0];
            topics.push({
              id: 3,
              title: truncateText(modInfo.titulo || 'Mod', 60),
              description: truncateText(modInfo.resumen || 'No description available', 120),
              badge: 'MOD',
              badgeColor: 'bg-purple-500',
              image: '🔧',
              url: modInfo.url,
              date: modInfo.fecha
            });
          }
        }

        // Add more news if we have less than 4 items
        if (topics.length < 4 && blogs && blogs[0]?.output?.noticias) {
          const additionalNews = blogs[0].output.noticias.slice(1, 5 - topics.length);
          additionalNews.forEach((noticia: any) => {
            topics.push({
              id: topics.length + 1,
              title: truncateText(noticia.titulo || 'News', 60),
              description: truncateText(noticia.resumen || 'No description available', 120),
              badge: 'NEWS',
              badgeColor: 'bg-[#00d2ff]',
              image: '📰',
              url: noticia.url,
              date: noticia.fecha
            });
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
            No trending content available at the moment
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
              isLast={index === trendingTopics.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}