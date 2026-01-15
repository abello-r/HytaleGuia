import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './components/LanguageSelector';
import { useServerTime } from './hooks/useServerTime';
import './i18n';

interface HealthCheck {
  status: string;
  timestamp?: string;
}

function App() {
  const { t } = useTranslation();
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const serverTime = useServerTime();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        setError(t('errors.backendConnection'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, [t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Language Selector */}
        <div className="flex justify-end mb-8">
          <LanguageSelector />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4">
              {t('header.title')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('header.subtitle')}
            </p>
          </header>

          {/* Server Time */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🕐</span>
                <span className="text-white font-medium text-lg">
                  {t('systemStatus.serverTime')}
                </span>
              </div>
              <div className="text-3xl font-bold text-white font-mono">
                {serverTime}
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('systemStatus.title')}
            </h2>
            
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                <span className="ml-4 text-white">{t('systemStatus.loading')}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {health && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/20 border border-green-500 rounded-lg">
                  <span className="text-white font-medium">{t('systemStatus.backend')}</span>
                  <span className="flex items-center text-green-300">
                    <span className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    {health.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
                  <span className="text-white font-medium">{t('systemStatus.frontend')}</span>
                  <span className="flex items-center text-blue-300">
                    <span className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                    {t('systemStatus.active')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-500/20 border border-purple-500 rounded-lg">
                  <span className="text-white font-medium">{t('systemStatus.ssl')}</span>
                  <span className="flex items-center text-purple-300">
                    <span className="w-3 h-3 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                    {t('systemStatus.configured')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Welcome Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-300 text-lg">
              {t('welcome')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
