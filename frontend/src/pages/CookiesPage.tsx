import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscordButton from '../components/DiscordButton';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

export default function CookiesPage() {
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
				title={t('cookies.seo.title')}
				description={t('cookies.seo.description')}
				keywords={t('cookies.seo.keywords')}
			/>
			<StructuredData
				type="BreadcrumbList"
				data={{
					items: [
						{ name: t('cookies.breadcrumbs.home'), url: 'https://hytaleguia.com' },
						{ name: t('cookies.breadcrumbs.cookies'), url: 'https://hytaleguia.com/cookies' }
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
							<a href="/" className="hover:text-[#00d2ff] transition cursor-pointer">{t('cookies.breadcrumbs.home')}</a>
							<span>›</span>
							<span className="text-white">{t('cookies.breadcrumbs.cookies')}</span>
						</div>
					</div>

					{/* Header */}
					<div className="max-w-5xl mx-auto mb-12 text-center">
						<h1 className="text-5xl font-bold mb-4">
							<span className="text-[#00d2ff]">{t('cookies.title')}</span>
						</h1>
						<p className="text-gray-400 text-sm">
							<strong>{t('cookies.lastUpdate')}:</strong> {t('cookies.date')}
						</p>
					</div>

					<div className="max-w-5xl mx-auto">
						{/* Intro */}
						<InfoBox>
							<p className="text-white">
								<strong>HytaleGuía</strong> {t('cookies.intro')}
							</p>
						</InfoBox>

						{/* 1. What are cookies */}
						<Section title={`1. ${t('cookies.what.title')}`}>
							<p className="text-gray-400 mb-3">{t('cookies.what.text')}</p>
							<p className="text-gray-400">{t('cookies.what.text2')}</p>
						</Section>

						{/* 2. Why we use cookies */}
						<Section title={`2. ${t('cookies.why.title')}`}>
							<ul className="list-disc list-inside text-gray-400 space-y-2">
								<li>{t('cookies.why.item1')}</li>
								<li>{t('cookies.why.item2')}</li>
								<li>{t('cookies.why.item3')}</li>
								<li>{t('cookies.why.item4')}</li>
								<li>{t('cookies.why.item5')}</li>
							</ul>
						</Section>

						{/* 3. Types of cookies */}
						<Section title={`3. ${t('cookies.types.title')}`}>
							<SubSection title={`3.1 ${t('cookies.types.technical.title')}`}>
								<p className="text-gray-400 mb-2"><strong className="text-white">{t('cookies.types.technical.purpose')}</strong> {t('cookies.types.technical.purposeText')}</p>
								<p className="text-gray-400 mb-2"><strong className="text-white">{t('cookies.types.technical.duration')}</strong> {t('cookies.types.technical.durationText')}</p>
								<p className="text-gray-400"><strong className="text-white">{t('cookies.types.technical.examples')}</strong> {t('cookies.types.technical.examplesText')}</p>
							</SubSection>

							<SubSection title={`3.2 ${t('cookies.types.analytics.title')}`}>
								<p className="text-gray-400 mb-2"><strong className="text-white">{t('cookies.types.analytics.purpose')}</strong> {t('cookies.types.analytics.purposeText')}</p>
								<p className="text-gray-400 mb-2"><strong className="text-white">{t('cookies.types.analytics.provider')}</strong> Google Analytics</p>
								<p className="text-gray-400 mb-2"><strong className="text-white">{t('cookies.types.analytics.duration')}</strong> {t('cookies.types.analytics.durationText')}</p>
								<p className="text-gray-400"><strong className="text-white">{t('cookies.types.analytics.info')}</strong> {t('cookies.types.analytics.infoText')}</p>
							</SubSection>

							<SubSection title={`3.3 ${t('cookies.types.advertising.title')}`}>
								<p className="text-gray-400 mb-2"><strong className="text-white">{t('cookies.types.advertising.purpose')}</strong> {t('cookies.types.advertising.purposeText')}</p>
								<p className="text-gray-400 mb-2"><strong className="text-white">{t('cookies.types.advertising.provider')}</strong> Google AdSense</p>
								<p className="text-gray-400 mb-2"><strong className="text-white">{t('cookies.types.advertising.duration')}</strong> {t('cookies.types.advertising.durationText')}</p>
								<p className="text-gray-400"><strong className="text-white">{t('cookies.types.advertising.info')}</strong> {t('cookies.types.advertising.infoText')}</p>
							</SubSection>

							<SubSection title={`3.4 ${t('cookies.types.thirdParty.title')}`}>
								<p className="text-gray-400">{t('cookies.types.thirdParty.text')}</p>
							</SubSection>
						</Section>

						{/* 4. Cookies Table */}
						<Section title={`4. ${t('cookies.table.title')}`}>
							<div className="overflow-x-auto">
								<table className="w-full border-collapse border border-white/10">
									<thead>
										<tr className="bg-white/5">
											<th className="border border-white/10 p-3 text-left text-white">{t('cookies.table.cookie')}</th>
											<th className="border border-white/10 p-3 text-left text-white">{t('cookies.table.purpose')}</th>
											<th className="border border-white/10 p-3 text-left text-white">{t('cookies.table.type')}</th>
											<th className="border border-white/10 p-3 text-left text-white">{t('cookies.table.duration')}</th>
										</tr>
									</thead>
									<tbody className="text-gray-400 text-sm">
										<tr>
											<td className="border border-white/10 p-3">session_id</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row1Purpose')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row1Type')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row1Duration')}</td>
										</tr>
										<tr className="bg-white/5">
											<td className="border border-white/10 p-3">_ga</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row2Purpose')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row2Type')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row2Duration')}</td>
										</tr>
										<tr>
											<td className="border border-white/10 p-3">_gid</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row3Purpose')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row3Type')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row3Duration')}</td>
										</tr>
										<tr className="bg-white/5">
											<td className="border border-white/10 p-3">_gat</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row4Purpose')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row4Type')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row4Duration')}</td>
										</tr>
										<tr>
											<td className="border border-white/10 p-3">__gads</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row5Purpose')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row5Type')}</td>
											<td className="border border-white/10 p-3">{t('cookies.table.row5Duration')}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</Section>

						{/* 5. Managing Cookies */}
						<Section title={`5. ${t('cookies.manage.title')}`}>
							<p className="text-gray-400 mb-4">{t('cookies.manage.text')}</p>

							<SubSection title={`5.1 ${t('cookies.manage.browser.title')}`}>
								<p className="text-gray-400 mb-3">{t('cookies.manage.browser.text')}</p>
								<ul className="list-disc list-inside text-gray-400 space-y-2">
									<li><strong className="text-white">Chrome:</strong> {t('cookies.manage.browser.chrome')}</li>
									<li><strong className="text-white">Firefox:</strong> {t('cookies.manage.browser.firefox')}</li>
									<li><strong className="text-white">Safari:</strong> {t('cookies.manage.browser.safari')}</li>
									<li><strong className="text-white">Edge:</strong> {t('cookies.manage.browser.edge')}</li>
								</ul>
							</SubSection>

							<SubSection title={`5.2 ${t('cookies.manage.optout.title')}`}>
								<p className="text-gray-400 mb-3">{t('cookies.manage.optout.text')}</p>
								<ul className="list-disc list-inside text-gray-400 space-y-2">
									<li>
										<strong className="text-white">Google Analytics:</strong>{' '}
										<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] hover:underline cursor-pointer">
											{t('cookies.manage.optout.analyticsLink')}
										</a>
									</li>
									<li>
										<strong className="text-white">Google Ads:</strong>{' '}
										<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] hover:underline cursor-pointer">
											{t('cookies.manage.optout.adsLink')}
										</a>
									</li>
								</ul>
							</SubSection>

							<InfoBox warning>
								<p className="text-yellow-400 font-bold mb-2">⚠️ {t('cookies.manage.warning.title')}</p>
								<p className="text-gray-300">{t('cookies.manage.warning.text')}</p>
							</InfoBox>
						</Section>

						{/* 6. Updates */}
						<Section title={`6. ${t('cookies.updates.title')}`}>
							<p className="text-gray-400">{t('cookies.updates.text')}</p>
						</Section>

						{/* 7. More Info */}
						<Section title={`7. ${t('cookies.moreInfo.title')}`}>
							<p className="text-gray-400 mb-3">{t('cookies.moreInfo.text')}</p>
							<ul className="list-disc list-inside text-gray-400 space-y-2">
								<li>
									<a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] hover:underline cursor-pointer">
										AllAboutCookies.org
									</a>
								</li>
								<li>
									<a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] hover:underline cursor-pointer">
										YourOnlineChoices.com
									</a>
								</li>
								<li>
									<a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] hover:underline cursor-pointer">
										{t('cookies.moreInfo.googlePolicies')}
									</a>
								</li>
							</ul>
						</Section>

						{/* Contact */}
						<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mt-12">
							<h2 className="text-3xl font-bold text-[#00d2ff] mb-6">📧 {t('cookies.contact.title')}</h2>
							<p className="text-gray-400 mb-4">{t('cookies.contact.text')}</p>
							<p className="text-white">
								<strong>{t('cookies.contact.email')}:</strong>{' '}
								<a href="mailto:legal@hytaleguia.com" className="text-[#00d2ff] hover:underline cursor-pointer">
									legal@hytaleguia.com
								</a>
							</p>
						</div>

						{/* Related Links */}
						<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mt-6">
							<p className="text-white mb-3"><strong>{t('cookies.related.title')}</strong></p>
							<div className="flex flex-wrap gap-3">
								<a href="/terminos-de-uso" className="text-[#00d2ff] hover:underline cursor-pointer">
									→ {t('cookies.related.terms')}
								</a>
								<a href="/privacidad" className="text-[#00d2ff] hover:underline cursor-pointer">
									→ {t('cookies.related.privacy')}
								</a>
							</div>
						</div>

						{/* Review Note */}
						<p className="text-center text-gray-400 text-sm italic mt-12">
							{t('cookies.reviewNote')}
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
