import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

export default function Header() {
	const { t } = useTranslation();
	const location = useLocation();

	// Check if a path is active
	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<nav className="relative z-50 mt-8">
			<div className="container mx-auto px-4">
				<div className="relative max-w-6xl mx-auto">
					<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4">
						<div className="flex items-center justify-between">
							{/* Logo */}
							<div className="flex items-center space-x-3">
								<a href="/" className="flex items-center space-x-2 cursor-pointer">
									<div className="w-8 h-8 bg-gradient-to-br from-[#00d2ff] to-[#0099cc] rounded flex items-center justify-center overflow-hidden">
										<img 
											src="/logo-96.png" 
											alt="Hytale Guía Logo" 
											className="w-full h-full object-cover"
										/>
									</div>
									<span className="text-white font-bold text-xl">
										HYTALE<span className="text-[#00d2ff]"> GUÍA</span>
									</span>
								</a>
							</div>

							{/* Navigation */}
							<div className="hidden md:flex items-center space-x-8">
								<a 
									href="/" 
									className={`relative transition cursor-pointer ${
										isActive('/') 
											? 'text-[#00d2ff] font-semibold' 
											: 'text-[#a0a0a0] hover:text-[#00d2ff]'
									}`}
								>
									{t('nav.home')}
									{isActive('/') && (
										<span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00d2ff]"></span>
									)}
								</a>
								<a 
									href="/noticias" 
									className={`relative transition cursor-pointer ${
										isActive('/noticias') 
											? 'text-[#00d2ff] font-semibold' 
											: 'text-[#a0a0a0] hover:text-[#00d2ff]'
									}`}
								>
									{t('nav.news')}
									{isActive('/noticias') && (
										<span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00d2ff]"></span>
									)}
								</a>
								<a 
									href="#" 
									className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer"
								>
									{t('nav.guides')}
								</a>
								<a 
									href="#" 
									className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer"
								>
									{t('nav.mods')}
								</a>
								<a 
									href="#" 
									className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer"
								>
									{t('nav.serverList')}
								</a>
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

					{/* Development badge - Glass style, bottom right */}
					<div className="absolute right-0 -bottom-4 z-10">
						<div className="bg-[#00d2ff]/10 backdrop-blur-md border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-medium px-3 py-1 rounded-full">
							{t('nav.devBadge')}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}