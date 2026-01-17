import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import Header from './components/Header';
import Footer from './components/Footer';
import DiscordButton from './components/DiscordButton';
import HeroSection from './components/HeroSection';
import TrendingSection from './components/TrendingSection';
import './i18n';

// Google Analytics
ReactGA.initialize('G-06EYV38MQG');

function App() {
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname });
	}, []);

	return (
		<div className="min-h-screen bg-[#0b0d12]">
			{/* Discord Sticky Button */}
			<DiscordButton />

			{/* Hero Section con fondo completo */}
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

export default App;