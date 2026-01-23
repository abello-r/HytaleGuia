import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Header from './components/Header';
import Footer from './components/Footer';
import DiscordButton from './components/DiscordButton';
import AIAssistantButton from './components/AIAssistantButton';
import AIChatModal from './components/AIChatModal';
import HeroSection from './components/HeroSection';
import TrendingSection from './components/TrendingSection';
import NewsPage from './pages/NewsPage';
import ModsPage from './pages/ModsPage';
import NotFoundPage from './pages/NotFoundPage';
import BugsPage from './pages/BugsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';

import SEO from './components/SEO';
import StructuredData from './components/StructuredData';
import { SEO_CONFIGS } from './utils/seoConfig';
import { ChatProvider } from './context/ChatContext';
import './i18n';

import CookieBanner from './components/CookieBanner';
import type { CookieConsent } from './utils/cookieConsent';
import { getCookieConsent } from './utils/cookieConsent';

const GA_MEASUREMENT_ID = 'G-06EYV38MQG';

function PageTracker({ analyticsEnabled }: { analyticsEnabled: boolean }) {
  const location = useLocation();

  useEffect(() => {
    if (!analyticsEnabled) return;
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location, analyticsEnabled]);

  return null;
}

function HomePage() {
  const seoConfig = SEO_CONFIGS['/'];

  return (
    <>
      <SEO {...seoConfig} />
      <StructuredData type="WebSite" data={{}} />
      <StructuredData type="Organization" data={{}} />

      <div className="min-h-screen bg-[#0b0d12]">
        <div className="relative min-h-screen flex flex-col">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/forest.png")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0b0d12]" />
          </div>

          <Header />
          <HeroSection />
        </div>

        <TrendingSection />
        <Footer />
      </div>
    </>
  );
}

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(() => getCookieConsent());
  const [gaReady, setGaReady] = useState(false);

  useEffect(() => {
    if (!consent?.analytics) return;

    if (!gaReady) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
      setGaReady(true);
    }
  }, [consent, gaReady]);

  return (
    <ChatProvider>
      <Router>
        <PageTracker analyticsEnabled={!!consent?.analytics && gaReady} />

        <DiscordButton />
        <AIAssistantButton onClick={() => setIsChatOpen(true)} />

        <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        <CookieBanner onConsentChange={(next) => setConsent(next)} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/noticias" element={<NewsPage />} />
          <Route path="/mods" element={<ModsPage />} />
          <Route path="/bugs" element={<BugsPage />} />
          <Route path="/terminos-de-uso" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App;
