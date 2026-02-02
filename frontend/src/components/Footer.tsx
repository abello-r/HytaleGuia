import { useTranslation } from 'react-i18next';

export default function Footer() {
	const { t } = useTranslation();
	const year = new Date().getFullYear();

	return (
		<footer className="relative bg-[#0b0d12] border-t border-white/10">
			<div className="container mx-auto px-4 py-8 md:py-12">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
					<div className="col-span-2 md:col-span-1 mb-4 md:mb-0">
						<a href="/" className="flex items-center space-x-2 mb-4 cursor-pointer w-fit">
							<div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#00d2ff] to-[#0099cc] rounded flex items-center justify-center overflow-hidden">
								<img src="/logo-96.png" alt="Hytale Guía Logo" className="w-full h-full object-cover" />
							</div>
							<span className="text-white font-bold text-lg md:text-xl">
								HYTALE<span className="text-[#00d2ff]"> GUÍA</span>
							</span>
						</a>
						<p className="text-[#a0a0a0] text-sm leading-relaxed">{t('footer.description')}</p>
					</div>

					<div>
						<h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">{t('footer.quickLinks')}</h3>
						<ul className="space-y-2">
							<li><a href="/noticias" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.news')}</a></li>
							<li><a href="/guias" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.guides')}</a></li>
							<li><a href="/mods" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.mods')}</a></li>
							<li><a href="/servidores" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.serverList')}</a></li>
							<li><a href="/bugs" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">Bugs</a></li>
						</ul>
					</div>

					<div>
						<h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">{t('footer.community')}</h3>
						<ul className="space-y-2">
							<li><a href="https://discord.com/invite/hytale" target="_blank" rel="noopener noreferrer" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.discord')}</a></li>
							<li><a href="https://x.com/Hytale" target="_blank" rel="noopener noreferrer" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.twitter')}</a></li>
							<li><a href="https://www.youtube.com/Hytale" target="_blank" rel="noopener noreferrer" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.youtube')}</a></li>
						</ul>
					</div>

					<div>
						<h3 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">{t('footer.legal')}</h3>
						<ul className="space-y-2">
							<li><a href="/terminos-de-uso" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.terms')}</a></li>
							<li><a href="/privacidad" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.privacy')}</a></li>
							<li><a href="/cookies" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.cookies')}</a></li>
						</ul>
					</div>
				</div>

				<div className="border-t border-white/10 mt-6 md:mt-8 pt-6 md:pt-8 text-center relative">
					<img
						src="/Love.png"
						alt="Kwebeck Love"
						className="absolute left-4 md:left-30 -top-0 md:-top-27 h-16 w-16 md:h-30 md:w-30 opacity-80 pointer-events-none select-none hidden lg:block"
					/>

					<p className="text-sm">
						<span className="text-[#00d2ff] font-semibold">© {year} HytaleGuía.</span>{' '}
						<span className="text-[#a0a0a0]">{t('footer.madeWith')}</span>
					</p>
					<p className="text-[#a0a0a0] text-xs mt-2 px-4 md:px-0">{t('footer.disclaimer')}</p>
				</div>
			</div>
		</footer>
	);
}
