import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscordButton from '../components/DiscordButton';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

export default function TermsPage() {
	const { t } = useTranslation();
	const [showScrollTop, setShowScrollTop] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const handleScroll = () => setShowScrollTop(window.scrollY > 500);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

	const InfoBox = ({ children, warning = false }: { children: React.ReactNode, warning?: boolean }) => (
		<div className={`${warning ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-[#00d2ff]/10 border-[#00d2ff]/30'} border backdrop-blur-sm rounded-xl p-6 mb-6`}>
			{children}
		</div>
	);

	const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
		<div className="mb-12">
			<h2 className="text-3xl font-bold text-[#00d2ff] mb-6 pb-3 border-b-2 border-[#00d2ff]/30">
				{title}
			</h2>
			{children}
		</div>
	);

	const SubSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
		<div className="mb-6">
			<h3 className="text-xl font-bold text-white mb-3">{title}</h3>
			{children}
		</div>
	);

	return (
		<>
			<SEO
				title={t('terms.seo.title')}
				description={t('terms.seo.description')}
				keywords={t('terms.seo.keywords')}
			/>
			<StructuredData
				type="BreadcrumbList"
				data={{
					items: [
						{ name: t('terms.breadcrumbs.home'), url: 'https://hytaleguia.com' },
						{ name: t('terms.breadcrumbs.terms'), url: 'https://hytaleguia.com/terminos-de-uso' }
					]
				}}
			/>

			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header />
				<DiscordButton />

				<main className="flex-1 container mx-auto px-4 py-24">
					{/* Breadcrumbs */}
					<div className="max-w-5xl mx-auto mb-6">
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<a href="/" className="hover:text-[#00d2ff] transition cursor-pointer">{t('terms.breadcrumbs.home')}</a>
							<span>›</span>
							<span className="text-white">{t('terms.breadcrumbs.terms')}</span>
						</div>
					</div>

					{/* Header */}
					<div className="max-w-5xl mx-auto mb-12 text-center">
						<h1 className="text-5xl font-bold mb-4">
							<span className="text-[#00d2ff]">{t('terms.title')}</span>
						</h1>
						<p className="text-gray-400 text-sm">
							<strong>{t('terms.lastUpdate')}:</strong> {t('terms.date')}
						</p>
					</div>

					<div className="max-w-5xl mx-auto">
						{/* Project Info */}
						<InfoBox>
							<p className="text-white mb-3">
								<strong>HytaleGuía</strong> {t('terms.projectDescription')}
							</p>
						</InfoBox>

						{/* Fan Site Warning */}
						<InfoBox warning>
							<p className="text-yellow-400 font-bold mb-2">⚠️ {t('terms.fansite')}</p>
							<p className="text-gray-300">
								<strong>Hytale</strong> {t('terms.trademark')} <strong>Hypixel Studios Canada Inc.</strong><br />
								{t('terms.notAffiliated')}
							</p>
						</InfoBox>

						{/* 1. Acceptance */}
						<Section title={`1. ${t('terms.acceptance.title')}`}>
							<p className="text-gray-400 mb-4">{t('terms.acceptance.text')}</p>
							<p className="text-gray-400">{t('terms.acceptance.text2')}</p>
						</Section>

						{/* 2. Access and Registration */}
						<Section title={`2. ${t('terms.access.title')}`}>
							<SubSection title={`2.1 ${t('terms.access.general')}`}>
								<ul className="list-disc list-inside text-gray-400 space-y-2">
									<li>{t('terms.access.item1')}</li>
									<li>{t('terms.access.item2')}</li>
									<li>{t('terms.access.item3')}</li>
								</ul>
							</SubSection>

							<SubSection title={`2.2 ${t('terms.access.registration')}`}>
								<p className="text-gray-400 mb-3">{t('terms.access.regText')}</p>
								<ul className="list-disc list-inside text-gray-400 space-y-2">
									<li>{t('terms.access.regItem1')}</li>
									<li>{t('terms.access.regItem2')}</li>
									<li>{t('terms.access.regItem3')}</li>
									<li>{t('terms.access.regItem4')}</li>
								</ul>
							</SubSection>
						</Section>

						{/* 3. Prohibited Conduct */}
						<Section title={`3. ${t('terms.conduct.title')}`}>
							<p className="text-gray-400 mb-4">{t('terms.conduct.text')}</p>
							<p className="text-gray-400 mb-3"><strong className="text-white">{t('terms.conduct.prohibited')}</strong></p>
							<ul className="list-disc list-inside text-gray-400 space-y-2">
								<li>{t('terms.conduct.item1')}</li>
								<li>{t('terms.conduct.item2')}</li>
								<li>{t('terms.conduct.item3')}</li>
								<li>{t('terms.conduct.item4')}</li>
								<li>{t('terms.conduct.item5')}</li>
							</ul>
							<p className="text-gray-400 mt-4">
								<strong className="text-white">{t('terms.conduct.consequences')}</strong> {t('terms.conduct.consequencesText')}
							</p>
						</Section>

						{/* 4. Intellectual Property */}
						<Section title={`4. ${t('terms.ip.title')}`}>
							<SubSection title={`4.1 ${t('terms.ip.siteContent')}`}>
								<p className="text-gray-400">{t('terms.ip.siteText')}</p>
							</SubSection>

							<SubSection title={`4.2 ${t('terms.ip.hytaleContent')}`}>
								<p className="text-gray-400 mb-3">{t('terms.ip.hytaleText')}</p>
								<p className="text-gray-400">
									<strong className="text-white">{t('terms.ip.notRedistribute')}</strong> {t('terms.ip.redistributeItems')}
								</p>
							</SubSection>

							<SubSection title={`4.3 ${t('terms.ip.userContent')}`}>
								<p className="text-gray-400 mb-3">{t('terms.ip.userText')}</p>
								<ul className="list-disc list-inside text-gray-400 space-y-2">
									<li>{t('terms.ip.userItem1')}</li>
									<li>{t('terms.ip.userItem2')}</li>
									<li>{t('terms.ip.userItem3')}</li>
								</ul>
							</SubSection>
						</Section>

						{/* 5. Doge AI */}
						<Section title={`5. ${t('terms.ai.title')}`}>
							<InfoBox>
								<p className="text-white mb-3">
									<strong>Doge AI</strong> {t('terms.ai.description')}
								</p>
								<p className="text-white mb-2"><strong>{t('terms.ai.limitations')}</strong></p>
								<ul className="list-disc list-inside text-gray-300 space-y-2">
									<li>{t('terms.ai.item1')}</li>
									<li>{t('terms.ai.item2')}</li>
									<li>{t('terms.ai.item3')}</li>
								</ul>
							</InfoBox>
						</Section>

						{/* 6. Monetization */}
						<Section title={`6. ${t('terms.monetization.title')}`}>
							<SubSection title={`6.1 ${t('terms.monetization.ads')}`}>
								<p className="text-gray-400 mb-3">{t('terms.monetization.adsText')}</p>
								<ul className="list-disc list-inside text-gray-400 space-y-2">
									<li>{t('terms.monetization.adsItem1')}</li>
									<li>{t('terms.monetization.adsItem2')}</li>
								</ul>
							</SubSection>

							<SubSection title={`6.2 ${t('terms.monetization.affiliates')}`}>
								<p className="text-gray-400">{t('terms.monetization.affiliatesText')}</p>
							</SubSection>
						</Section>

						{/* 7. Minors */}
						<Section title={`7. ${t('terms.minors.title')}`}>
							<p className="text-gray-400 mb-3">{t('terms.minors.text')}</p>
							<p className="text-gray-400"><strong className="text-white">{t('terms.minors.prohibited')}</strong> {t('terms.minors.prohibitedText')}</p>
						</Section>

						{/* 8. Copyright */}
						<Section title={`8. ${t('terms.copyright.title')}`}>
							<p className="text-gray-400 mb-3">{t('terms.copyright.text')}</p>
							<p className="text-white mb-3">
								📧 <a href="mailto:legal@hytaleguia.com" className="text-[#00d2ff] hover:underline cursor-pointer">legal@hytaleguia.com</a>
							</p>
							<p className="text-gray-400 mb-2"><strong className="text-white">{t('terms.copyright.include')}</strong></p>
							<ul className="list-disc list-inside text-gray-400 space-y-2">
								<li>{t('terms.copyright.item1')}</li>
								<li>{t('terms.copyright.item2')}</li>
								<li>{t('terms.copyright.item3')}</li>
							</ul>
						</Section>

						{/* 9. Liability */}
						<Section title={`9. ${t('terms.liability.title')}`}>
							<p className="text-gray-400 mb-3"><strong className="text-white">{t('terms.liability.notGuarantee')}</strong></p>
							<ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
								<li>{t('terms.liability.item1')}</li>
								<li>{t('terms.liability.item2')}</li>
								<li>{t('terms.liability.item3')}</li>
							</ul>
							<p className="text-gray-400 mb-3"><strong className="text-white">{t('terms.liability.notResponsible')}</strong></p>
							<ul className="list-disc list-inside text-gray-400 space-y-2">
								<li>{t('terms.liability.item4')}</li>
								<li>{t('terms.liability.item5')}</li>
								<li>{t('terms.liability.item6')}</li>
							</ul>
						</Section>

						{/* Development Warning */}
						<InfoBox warning>
							<p className="text-yellow-400 font-bold mb-3">⚠️ {t('terms.development.title')}</p>
							<p className="text-gray-300 mb-3">{t('terms.development.text')}</p>
							<p className="text-white mb-2"><strong>{t('terms.development.honest')}</strong></p>
							<ul className="list-disc list-inside text-gray-300 space-y-2">
								<li>{t('terms.development.item1')}</li>
								<li>{t('terms.development.item2')}</li>
								<li>{t('terms.development.item3')}</li>
								<li>{t('terms.development.item4')}</li>
							</ul>
						</InfoBox>

						{/* 10. Modifications */}
						<Section title={`10. ${t('terms.modifications.title')}`}>
							<p className="text-gray-400">{t('terms.modifications.text')}</p>
						</Section>

						{/* 11. Jurisdiction */}
						<Section title={`11. ${t('terms.jurisdiction.title')}`}>
							<p className="text-gray-400">{t('terms.jurisdiction.text')}</p>
						</Section>

						{/* Contact */}
						<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mt-12">
							<h2 className="text-3xl font-bold text-[#00d2ff] mb-6">📧 {t('terms.contact.title')}</h2>
							<p className="text-gray-400 mb-4">{t('terms.contact.text')}</p>
							<div className="space-y-2">
								<p className="text-white">
									<strong>{t('terms.contact.general')}:</strong>{' '}
									<a href="mailto:contacto@hytaleguia.com" className="text-[#00d2ff] hover:underline cursor-pointer">
										contacto@hytaleguia.com
									</a>
								</p>
								<p className="text-white">
									<strong>{t('terms.contact.legal')}:</strong>{' '}
									<a href="mailto:legal@hytaleguia.com" className="text-[#00d2ff] hover:underline cursor-pointer">
										legal@hytaleguia.com
									</a>
								</p>
							</div>
						</div>

						{/* Review Note */}
						<p className="text-center text-gray-400 text-sm italic mt-12">
							{t('terms.reviewNote')}
						</p>
					</div>
				</main>

				{/* Scroll to top */}
				{showScrollTop && (
					<button
						onClick={scrollToTop}
						className="fixed bottom-8 right-8 bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
						aria-label="Volver arriba"
					>
						<span className="text-2xl">↑</span>
					</button>
				)}

				<Footer />
			</div>
		</>
	);
}
