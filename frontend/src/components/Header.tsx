import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';
import LanguageSelector from './LanguageSelector';
import AchievementsModal from './AchievementsModal';

const hasSessionCookie = () => document.cookie.includes('__session');

const TrophyIcon = () => (
	<svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
		<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
		<path d="M4 22h16" />
		<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
		<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
		<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
	</svg>
);

export default function Header() {
	const { t } = useTranslation();
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [achievementsOpen, setAchievementsOpen] = useState(false);
	const { isLoaded } = useAuth();
	const [hadSession] = useState(hasSessionCookie);

	const isActive = (path: string) => location.pathname === path;
	const closeMobileMenu = () => setMobileMenuOpen(false);

	const navLinks = [
		{ path: '/', label: 'nav.home' },
		{ path: '/noticias', label: 'nav.news' },
		{ path: '/mods', label: 'nav.mods' },
		{ path: '/bugs', label: 'nav.bugs' },
		{ path: '/guias', label: 'nav.guides' },
	];

	const disabledLinks = [
		{ label: 'nav.serverList' },
	];

	const userButtonAppearance = {
		elements: {
			avatarBox: 'w-10 h-10 ring-2 ring-[#00d2ff]/50 hover:ring-[#00d2ff]',
			userButtonPopoverCard: 'bg-[#0b0d12]/95 backdrop-blur-xl border border-white/10',
			userButtonPopoverActionButton: 'hover:bg-white/5',
			userButtonPopoverActionButtonText: 'text-gray-300',
			userButtonPopoverActionButtonIcon: 'text-gray-400',
			userButtonPopoverFooter: 'hidden',
		}
	};

	return (
		<>
			<nav className="sticky top-0 z-[60] md:relative md:mt-8 bg-[#0b0d12] md:bg-transparent">
				<div className="md:hidden border-b border-white/10 px-4 py-3">
					<div className="flex items-center justify-between">
						<a href="/" className="flex items-center space-x-2 cursor-pointer">
							<img src="/logo-96.png" alt="Logo" className="w-8 h-8 rounded" />
							<span className="text-white font-bold">HYTALE<span className="text-[#00d2ff]"> GUÍA</span></span>
						</a>

						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="text-white p-2 cursor-pointer"
							aria-label="Menu"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								{mobileMenuOpen ? (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>
				</div>

				<div className="hidden md:block container mx-auto px-4">
					<div className="relative max-w-6xl mx-auto">
						<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4">
							<div className="flex items-center justify-between">
								<a href="/" className="flex items-center space-x-2 cursor-pointer">
									<div className="w-8 h-8 bg-gradient-to-br from-[#00d2ff] to-[#0099cc] rounded flex items-center justify-center overflow-hidden">
										<img src="/logo-96.png" alt="Hytale Guía Logo" className="w-full h-full object-cover" />
									</div>
									<span className="text-white font-bold text-xl">
										HYTALE<span className="text-[#00d2ff]"> GUÍA</span>
									</span>
								</a>

								<div className="flex items-center space-x-6">
									{navLinks.map(link => (
										<a
											key={link.path}
											href={link.path}
											className={`relative transition cursor-pointer ${isActive(link.path) ? 'text-[#00d2ff] font-semibold' : 'text-[#a0a0a0] hover:text-[#00d2ff]'}`}
										>
											{t(link.label)}
											{isActive(link.path) && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00d2ff]" />}
										</a>
									))}

									{disabledLinks.map(link => (
										<div key={link.label} className="relative group">
											<span className="text-[#a0a0a0] cursor-not-allowed opacity-60">{t(link.label)}</span>
											<span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-[#0b0d12] text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
												{t('nav.comingSoon')}
											</span>
										</div>
									))}
								</div>

								<div className="flex items-center space-x-4">
									<LanguageSelector />

									{!isLoaded ? (
										hadSession ? (
											<div className="bg-white/5 rounded-full animate-pulse w-10 h-10" />
										) : (
											<div className="bg-white/5 rounded-lg animate-pulse h-10 w-28" />
										)
									) : (
										<>
											<SignedOut>
												<SignInButton mode="modal">
													<button className="bg-gradient-to-r from-[#00d2ff] to-[#0099cc] hover:from-[#0099cc] hover:to-[#00d2ff] text-[#0b0d12] px-8 py-2 rounded-lg font-bold transition cursor-pointer">
														{t('auth.login')}
													</button>
												</SignInButton>
											</SignedOut>
											<SignedIn>
												<UserButton appearance={userButtonAppearance}>
													<UserButton.MenuItems>
														<UserButton.Action
															label={t('nav.achievements')}
															labelIcon={<TrophyIcon />}
															onClick={() => setAchievementsOpen(true)}
														/>
													</UserButton.MenuItems>
												</UserButton>
											</SignedIn>
										</>
									)}
								</div>
							</div>
						</div>

						<div className="absolute right-0 -bottom-4 z-10">
							<div className="bg-[#00d2ff]/10 backdrop-blur-md border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-medium px-3 py-1 rounded-full">
								{t('nav.devBadge')}
							</div>
						</div>
					</div>
				</div>
			</nav>

			{mobileMenuOpen && (
				<div className="md:hidden fixed inset-0 z-40 bg-[#0b0d12]">
					<div className="flex flex-col h-full pt-16">
						<div className="flex-1 flex flex-col items-center justify-center space-y-6">
							{navLinks.map(link => (
								<a
									key={link.path}
									href={link.path}
									onClick={closeMobileMenu}
									className={`text-2xl font-bold transition cursor-pointer ${isActive(link.path) ? 'text-[#00d2ff]' : 'text-white'}`}
								>
									{t(link.label)}
								</a>
							))}

							{disabledLinks.map(link => (
								<div key={link.label} className="flex items-center gap-2">
									<span className="text-2xl font-bold text-gray-600">{t(link.label)}</span>
									<span className="bg-yellow-500/90 text-[#0b0d12] text-[10px] font-bold px-1.5 py-0.5 rounded">{t('nav.comingSoon')}</span>
								</div>
							))}
						</div>

						<div className="p-6 border-t border-white/10">
							<div className="flex items-center justify-between">
								<LanguageSelector compact />

								{!isLoaded ? (
									hadSession ? (
										<div className="bg-white/5 rounded-full animate-pulse w-10 h-10" />
									) : (
										<div className="bg-white/5 rounded-lg animate-pulse h-10 w-24" />
									)
								) : (
									<>
										<SignedOut>
											<SignInButton mode="modal">
												<button className="bg-gradient-to-r from-[#00d2ff] to-[#0099cc] text-[#0b0d12] px-6 py-2 rounded-lg font-bold cursor-pointer">
													{t('auth.login')}
												</button>
											</SignInButton>
										</SignedOut>
										<SignedIn>
											<UserButton appearance={userButtonAppearance}>
												<UserButton.MenuItems>
													<UserButton.Action
														label={t('nav.achievements')}
														labelIcon={<TrophyIcon />}
														onClick={() => { closeMobileMenu(); setAchievementsOpen(true); }}
													/>
												</UserButton.MenuItems>
											</UserButton>
										</SignedIn>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			<AchievementsModal isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
		</>
	)
}
