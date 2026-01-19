import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Header from './components/Header';
import Footer from './components/Footer';
import DiscordButton from './components/DiscordButton';
import HeroSection from './components/HeroSection';
import TrendingSection from './components/TrendingSection';
import NewsPage from './pages/NewsPage';
import ModsPage from './pages/ModsPage';
import './i18n';

// Google Analytics
ReactGA.initialize('G-06EYV38MQG');

// Component to track page views
function PageTracker() {
	const location = useLocation();

	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: location.pathname });
	}, [location]);

	return null;
}

// Home page component
function HomePage() {
	return (
		<div className="min-h-screen bg-[#0b0d12]">
			{/* Discord Sticky Button */}
			<DiscordButton />

			{/* Hero Section with full background */}
			<div className="relative min-h-screen flex flex-col">
				{/* Background image */}
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: 'url("/forest.png")',
					}}
				>
					<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0b0d12]"></div>
				</div>

				{/* Header */}
				<Header />

				{/* Hero Content */}
				<HeroSection />
			</div>

			{/* Trending Section */}
			<TrendingSection />

			{/* Footer */}
			<Footer />
		</div>
	);
}

function App() {
	return (
		<Router>
			<PageTracker />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/noticias" element={<NewsPage />} />
				<Route path="/mods" element={<ModsPage />} />
			</Routes>
		</Router>
	);
}

export default App;