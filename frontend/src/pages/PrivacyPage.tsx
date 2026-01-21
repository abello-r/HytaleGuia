import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscordButton from '../components/DiscordButton';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

export default function PrivacyPage() {
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
				title={t('privacy.seo.title')}
				description={t('privacy.seo.description')}
				keywords={t('privacy.seo.keywords')}
			/>
			<StructuredData
				type="BreadcrumbList"
				data={{
					items: [
						{ name: t('privacy.breadcrumbs.home'), url: 'https://hytaleguia.com' },
						{ name: t('privacy.breadcrumbs.privacy'), url: 'https://hytaleguia.com/privacidad' }
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
							<a href="/" className="hover:text-[#00d2ff] transition cursor-pointer">{t('privacy.breadcrumbs.home')}</a>
							<span>›</span>
							<span className="text-white">{t('privacy.breadcrumbs.privacy')}</span>
						</div>
					</div>

					{/* Header */}
					<div className="max-w-5xl mx-auto mb-12 text-center">
						<h1 className="text-5xl font-bold mb-4">
							<span className="text-[#00d2ff]">{t('privacy.title')}</span>
						</h1>
						<p className="text-gray-400 text-sm">
							<strong>{t('privacy.lastUpdate')}:</strong> {t('privacy.date')}
						</p>
					</div>

					<div className="max-w-5xl mx-auto">
						{/* Intro */}
						<InfoBox>
							<p className="text-white">
								<strong>HytaleGuía</strong> {t('privacy.intro')}
							</p>
						</InfoBox>

						{/* GDPR Notice */}
						<InfoBox warning>
							<p className="text-yellow-400 font-bold mb-2">🛡️ {t('privacy.gdpr.title')}</p>
							<p className="text-gray-300">{t('privacy.gdpr.text')}</p>
						</InfoBox>

						{/* 1. Responsible */}
						<Section title={`1. ${t('privacy.responsible.title')}`}>
							<p className="text-gray-400 mb-3">{t('privacy.responsible.text')}</p>
							<div className="bg-white/5 border border-white/10 rounded-lg p-4">
								<p className="text-white mb-2"><strong>{t('privacy.responsible.project')}</strong> HytaleGuía</p>
								<p className="text-white mb-2"><strong>{t('privacy.responsible.contact')}</strong></p>
								<p className="text-gray-400">📧 legal@hytaleguia.com</p>
								<p className="text-gray-400">📧 contacto@hytaleguia.com</p>
							</div>
						</Section>

						{/* 2. Data Collection */}
						<Section title={`2. ${t('privacy.collection.title')}`}>
							<SubSection title={`2.1 ${t('privacy.collection.registration')}`}>
								<p className="text-gray-400 mb-3">{t('privacy.collection.regText')}</p>
								<ul className="list-disc list-inside text-gray-400 space-y-2">
									<li>{t('privacy.collection.regItem1')}</li>
									<li>{t('privacy.collection.regItem2')}</li>
									<li>{t('privacy.collection.regItem3')}</li>
								</ul>
							</SubSection>

							<SubSection title={`2.2 ${t('privacy.collection.navigation')}`}>
								<p className="text-gray-400 mb-3">{t('privacy.collection.navText')}</p>
								<ul className="list-disc list-inside text-gray-400 space-y-2">
									<li>{t('privacy.collection.navItem1')}</li>
									<li>{t('privacy.collection.navItem2')}</li>
									<li>{t('privacy.collection.navItem3')}</li>
									<li>{t('privacy.collection.navItem4')}</li>
								</ul>
							</SubSection>

							<SubSection title={`2.3 ${t('privacy.collection.content')}`}>
								<p className="text-gray-400">{t('privacy.collection.contentText')}</p>
							</SubSection>
						</Section>

						{/* 3. Purpose */}
						<Section title={`3. ${t('privacy.purpose.title')}`}>
							<p className="text-gray-400 mb-3">{t('privacy.purpose.text')}</p>
							<ul className="list-disc list-inside text-gray-400 space-y-2">
								<li>{t('privacy.purpose.item1')}</li>
								<li>{t('privacy.purpose.item2')}</li>
								<li>{t('privacy.purpose.item3')}</li>
								<li>{t('privacy.purpose.item4')}</li>
								<li>{t('privacy.purpose.item5')}</li>
								<li>{t('privacy.purpose.item6')}</li>
							</ul>
						</Section>

						{/* 4. Legal Basis */}
						<Section title={`4. ${t('privacy.legal.title')}`}>
							<ul className="list-disc list-inside text-gray-400 space-y-3">
								<li><strong className="text-white">{t('privacy.legal.item1Title')}</strong> {t('privacy.legal.item1Text')}</li>
								<li><strong className="text-white">{t('privacy.legal.item2Title')}</strong> {t('privacy.legal.item2Text')}</li>
								<li><strong className="text-white">{t('privacy.legal.item3Title')}</strong> {t('privacy.legal.item3Text')}</li>
							</ul>
						</Section>

						{/* 5. Data Sharing */}
						<Section title={`5. ${t('privacy.sharing.title')}`}>
							<p className="text-gray-400 mb-4">{t('privacy.sharing.text')}</p>

							<SubSection title={`5.1 ${t('privacy.sharing.thirdParty')}`}>
								<ul className="list-disc list-inside text-gray-400 space-y-2">
									<li><strong className="text-white">Google Analytics:</strong> {t('privacy.sharing.analytics')}</li>
									<li><strong className="text-white">Google AdSense:</strong> {t('privacy.sharing.ads')}</li>
								</ul>
							</SubSection>

							<SubSection title={`5.2 ${t('privacy.sharing.noSale')}`}>
								<p className="text-gray-400">{t('privacy.sharing.noSaleText')}</p>
							</SubSection>
						</Section>

						{/* 6. User Rights */}
						<Section title={`6. ${t('privacy.rights.title')}`}>
							<InfoBox>
								<p className="text-white mb-3"><strong>{t('privacy.rights.gdprRights')}</strong></p>
								<ul className="list-disc list-inside text-gray-300 space-y-2">
									<li><strong>{t('privacy.rights.access')}</strong> {t('privacy.rights.accessText')}</li>
									<li><strong>{t('privacy.rights.rectification')}</strong> {t('privacy.rights.rectificationText')}</li>
									<li><strong>{t('privacy.rights.deletion')}</strong> {t('privacy.rights.deletionText')}</li>
									<li><strong>{t('privacy.rights.opposition')}</strong> {t('privacy.rights.oppositionText')}</li>
									<li><strong>{t('privacy.rights.portability')}</strong> {t('privacy.rights.portabilityText')}</li>
									<li><strong>{t('privacy.rights.limitation')}</strong> {t('privacy.rights.limitationText')}</li>
								</ul>
							</InfoBox>
							<p className="text-gray-400 mt-4">
								<strong className="text-white">{t('privacy.rights.howToExercise')}</strong> {t('privacy.rights.howToExerciseText')}
							</p>
							<p className="text-white mt-2">
								📧 <a href="mailto:legal@hytaleguia.com" className="text-[#00d2ff] hover:underline cursor-pointer">legal@hytaleguia.com</a>
							</p>
						</Section>

						{/* 7. Data Retention */}
						<Section title={`7. ${t('privacy.retention.title')}`}>
							<ul className="list-disc list-inside text-gray-400 space-y-2">
								<li><strong className="text-white">{t('privacy.retention.accounts')}</strong> {t('privacy.retention.accountsText')}</li>
								<li><strong className="text-white">{t('privacy.retention.analytics')}</strong> {t('privacy.retention.analyticsText')}</li>
								<li><strong className="text-white">{t('privacy.retention.content')}</strong> {t('privacy.retention.contentText')}</li>
							</ul>
						</Section>

						{/* 8. Security */}
						<Section title={`8. ${t('privacy.security.title')}`}>
							<p className="text-gray-400 mb-3">{t('privacy.security.text')}</p>
							<ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
								<li>{t('privacy.security.item1')}</li>
								<li>{t('privacy.security.item2')}</li>
								<li>{t('privacy.security.item3')}</li>
								<li>{t('privacy.security.item4')}</li>
							</ul>
							<InfoBox warning>
								<p className="text-yellow-400 font-bold mb-2">⚠️ {t('privacy.security.warning')}</p>
								<p className="text-gray-300">{t('privacy.security.warningText')}</p>
							</InfoBox>
						</Section>

						{/* 9. Minors */}
						<Section title={`9. ${t('privacy.minors.title')}`}>
							<p className="text-gray-400 mb-3">{t('privacy.minors.text')}</p>
							<p className="text-gray-400">{t('privacy.minors.parentsText')}</p>
						</Section>

						{/* 10. International Transfers */}
						<Section title={`10. ${t('privacy.transfers.title')}`}>
							<p className="text-gray-400 mb-3">{t('privacy.transfers.text')}</p>
							<p className="text-gray-400">{t('privacy.transfers.providers')}</p>
						</Section>

						{/* 11. Changes */}
						<Section title={`11. ${t('privacy.changes.title')}`}>
							<p className="text-gray-400">{t('privacy.changes.text')}</p>
						</Section>

						{/* Contact */}
						<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mt-12">
							<h2 className="text-3xl font-bold text-[#00d2ff] mb-6">📧 {t('privacy.contact.title')}</h2>
							<p className="text-gray-400 mb-4">{t('privacy.contact.text')}</p>
							<div className="space-y-2">
								<p className="text-white">
									<strong>{t('privacy.contact.privacy')}:</strong>{' '}
									<a href="mailto:legal@hytaleguia.com" className="text-[#00d2ff] hover:underline cursor-pointer">
										legal@hytaleguia.com
									</a>
								</p>
								<p className="text-white">
									<strong>{t('privacy.contact.general')}:</strong>{' '}
									<a href="mailto:contacto@hytaleguia.com" className="text-[#00d2ff] hover:underline cursor-pointer">
										contacto@hytaleguia.com
									</a>
								</p>
							</div>
						</div>

						{/* Related Links */}
						<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mt-6">
							<p className="text-white mb-3"><strong>{t('privacy.related.title')}</strong></p>
							<div className="flex flex-wrap gap-3">
								<a href="/terminos-de-uso" className="text-[#00d2ff] hover:underline cursor-pointer">
									→ {t('privacy.related.terms')}
								</a>
								<a href="/cookies" className="text-[#00d2ff] hover:underline cursor-pointer">
									→ {t('privacy.related.cookies')}
								</a>
							</div>
						</div>

						{/* Review Note */}
						<p className="text-center text-gray-400 text-sm italic mt-12">
							{t('privacy.reviewNote')}
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
