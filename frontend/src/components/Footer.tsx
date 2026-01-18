import { useTranslation } from 'react-i18next';

export default function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="relative bg-[#0b0d12] border-t border-white/10">
			<div className="container mx-auto px-4 py-12">
				<div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
					{/* Column 1 - Logo and description */}
					<div className="md:col-span-1">
						<div className="flex items-center space-x-2 mb-4 cursor-pointer">
							<div className="w-10 h-10 bg-gradient-to-br from-[#00d2ff] to-[#0099cc] rounded flex items-center justify-center overflow-hidden">
								<img 
									src="/logo-96.png" 
									alt="Hytale Guía Logo" 
									className="w-full h-full object-cover"
								/>
							</div>
							<span className="text-white font-bold text-xl">
								HYTALE<span className="text-[#00d2ff]"> GUÍA</span>
							</span>
						</div>
						<p className="text-[#a0a0a0] text-sm leading-relaxed">
							{t('footer.description')}
						</p>
					</div>

					{/* Column 2 - Quick links */}
					<div>
						<h3 className="text-white font-bold mb-4">{t('footer.quickLinks')}</h3>
						<ul className="space-y-2">
							<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.home')}</a></li>
							<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.news')}</a></li>
							<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.guides')}</a></li>
							<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.mods')}</a></li>
							<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.serverList')}</a></li>
						</ul>
					</div>

					{/* Column 3 - Community */}
					<div>
						<h3 className="text-white font-bold mb-4">{t('footer.community')}</h3>
						<ul className="space-y-2">
							<li><a href="https://discord.com/invite/hytale" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.discord')}</a></li>
							<li><a href="https://x.com/Hytale" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.twitter')}</a></li>
							<li><a href="https://www.youtube.com/Hytale" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.youtube')}</a></li>
						</ul>
					</div>

					{/* Column 4 - Legal */}
					<div>
						<h3 className="text-white font-bold mb-4">{t('footer.legal')}</h3>
						<ul className="space-y-2">
							<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.terms')}</a></li>
							<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.privacy')}</a></li>
							<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.cookies')}</a></li>
							<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.contact')}</a></li>
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-t border-white/10 mt-8 pt-8 text-center">
					<p className="text-[#a0a0a0] text-sm">
						{t('footer.copyright')}
						<span className="text-[#00d2ff]"> {t('footer.madeWith')}</span>
					</p>
					<p className="text-[#a0a0a0] text-xs mt-2">
						{t('footer.disclaimer')}
					</p>
				</div>
			</div>
		</footer>
	);
}