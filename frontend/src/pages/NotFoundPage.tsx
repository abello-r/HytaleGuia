import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function NotFoundPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleGoHome = () => {
		navigate('/');
	};

	return (
		<>
			<SEO 
				title={t('notFound.seo.title')}
				description={t('notFound.seo.description')}
				keywords={t('notFound.seo.keywords')}
			/>

			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				{/* Hero Section with 404 background */}
				<div className="relative min-h-screen flex flex-col">
					{/* Background image */}
					<div
						className="absolute inset-0 bg-cover bg-center"
						style={{
							backgroundImage: 'url("/404.jpg")',
						}}
					>
						<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0b0d12]"></div>
					</div>

					{/* Header */}
					<Header />

					{/* Content */}
					<main className="flex-1 flex items-center justify-center px-4 relative z-10">
						<div className="max-w-2xl w-full text-center">
							{/* Title */}
							<h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
								{t('notFound.title')}
							</h1>

							{/* Description */}
							<p className="text-gray-300 text-xl md:text-2xl mb-12 max-w-md mx-auto drop-shadow-lg">
								{t('notFound.description')}
							</p>

							{/* Glass button */}
							<button
								onClick={handleGoHome}
								className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-[#ffffff]/50 text-white font-bold px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-100 text-lg cursor-pointer mx-auto flex items-center justify-center"
							>
								<span className="flex items-center justify-center gap-2">
									<span>←</span>
									<span>{t('notFound.backToHome')}</span>
								</span>
							</button>
						</div>
					</main>
				</div>

				<Footer />
			</div>
		</>
	);
}