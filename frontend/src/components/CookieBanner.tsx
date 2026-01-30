import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CookieConsent, getCookieConsent, setCookieConsent } from '../utils/cookieConsent';

type CookieBannerProps = {
	onConsentChange?: (consent: CookieConsent | null) => void;
};

export default function CookieBanner({ onConsentChange }: CookieBannerProps) {
	const { t } = useTranslation();
	const [isVisible, setIsVisible] = useState(false);
	const [isConfigOpen, setIsConfigOpen] = useState(false);

	const existingConsent = useMemo(() => getCookieConsent(), []);

	const [analytics, setAnalytics] = useState(existingConsent?.analytics ?? false);
	const [ads, setAds] = useState(existingConsent?.ads ?? false);

	useEffect(() => {
		if (!getCookieConsent()) setIsVisible(true);
	}, []);

	const acceptAll = () => {
		const consent = setCookieConsent({ analytics: true, ads: true });
		onConsentChange?.(consent);
		setIsVisible(false);
	};

	const rejectAll = () => {
		const consent = setCookieConsent({ analytics: false, ads: false });
		onConsentChange?.(consent);
		setIsVisible(false);
	};

	const saveSettings = () => {
		const consent = setCookieConsent({ analytics, ads });
		onConsentChange?.(consent);
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div className="fixed inset-0 md:inset-auto md:right-4 md:bottom-4 z-[120] flex items-center justify-center md:block">
			<div className="absolute inset-0 bg-black/50 md:hidden" onClick={rejectAll} />
			
			<div className="relative w-[320px] max-w-[92vw] overflow-hidden rounded-2xl border border-white/20 bg-[#0b0d12]/95 md:bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
				<div className="p-4 text-center">
					<p className="text-white font-semibold mb-2">{t('cookieBanner.title')}</p>

					<p className="text-xs text-white/70 leading-relaxed">
						{t('cookieBanner.description')}{' '}
						<a href="/cookies" className="text-[#00d2ff] hover:underline cursor-pointer">
							{t('cookieBanner.learnMore')}
						</a>
					</p>

					{isConfigOpen && (
						<div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 text-left">
							<p className="text-xs text-white/50 mb-3 text-center">{t('cookieBanner.settingsHint')}</p>

							<div className="space-y-3">
								<label className="flex items-center justify-between gap-4 cursor-pointer">
									<span className="text-sm text-white/80">{t('cookieBanner.analytics')}</span>
									<input
										type="checkbox"
										checked={analytics}
										onChange={(e) => setAnalytics(e.target.checked)}
										className="cursor-pointer"
									/>
								</label>

								<label className="flex items-center justify-between gap-4 cursor-pointer">
									<span className="text-sm text-white/80">{t('cookieBanner.ads')}</span>
									<input
										type="checkbox"
										checked={ads}
										onChange={(e) => setAds(e.target.checked)}
										className="cursor-pointer"
									/>
								</label>
							</div>
						</div>
					)}

					<div className="mt-4 flex flex-col gap-2">
						<div className="flex gap-2 justify-center">
							<button
								onClick={rejectAll}
								className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-1.5 rounded-lg transition cursor-pointer"
							>
								{t('cookieBanner.reject')}
							</button>

							<button
								onClick={() => setIsConfigOpen((v) => !v)}
								className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00d2ff]/40 text-white/70 hover:text-white px-4 py-1.5 rounded-lg transition cursor-pointer"
							>
								{t('cookieBanner.configure')}
							</button>
						</div>

						<button
							onClick={isConfigOpen ? saveSettings : acceptAll}
							className="bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] font-semibold px-4 py-1.5 rounded-lg transition cursor-pointer"
						>
							{isConfigOpen ? t('cookieBanner.save') : t('cookieBanner.accept')}
						</button>
					</div>

					<p className="text-[11px] text-white/30 mt-3">{t('cookieBanner.note')}</p>
				</div>

				<div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00d2ff]/40 to-transparent" />
			</div>
		</div>
	);
}
