import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function Header() {
	const { t } = useTranslation();

	return (
		<nav className="relative z-50 mt-8">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<div className="flex items-center space-x-2 cursor-pointer">
							<div className="w-8 h-8 bg-gradient-to-br from-[#00d2ff] to-[#0099cc] rounded"></div>
							<span className="text-white font-bold text-xl">
								HYTALE<span className="text-[#00d2ff]"> GUÍA</span>
							</span>
						</div>

						{/* Navigation */}
						<div className="hidden md:flex items-center space-x-8">
							<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.home')}</a>
							<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.news')}</a>
							<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.guides')}</a>
							<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.mods')}</a>
							<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.serverList')}</a>
						</div>

						{/* Right side */}
						<div className="flex items-center space-x-4 relative z-50">
							<LanguageSelector />
							<button className="bg-gradient-to-r from-[#00d2ff] to-[#0099cc] hover:from-[#0099cc] hover:to-[#00d2ff] text-[#0b0d12] px-8 py-2 rounded-lg font-bold transition cursor-pointer">
								{t('auth.login')}
							</button>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}