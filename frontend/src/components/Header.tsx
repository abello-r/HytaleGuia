import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';
import LanguageSelector from './LanguageSelector';

const hasSessionCookie = () => document.cookie.includes('__session');

export default function Header() {
	const { t } = useTranslation();
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { isLoaded } = useAuth();
	const [hadSession] = useState(hasSessionCookie);

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const closeMobileMenu = () => {
		setMobileMenuOpen(false);
	};

	return (
		<nav className="relative z-50 mt-8">
			<div className="container mx-auto px-4">
				<div className="relative max-w-6xl mx-auto">
					<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 md:px-8 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<a href="/" className="flex items-center space-x-2 cursor-pointer">
									<div className="w-8 h-8 bg-gradient-to-br from-[#00d2ff] to-[#0099cc] rounded flex items-center justify-center overflow-hidden">
										<img
											src="/logo-96.png"
											alt="Hytale Guía Logo"
											className="w-full h-full object-cover"
										/>
									</div>
									<span className="text-white font-bold text-lg md:text-xl">
										HYTALE<span className="text-[#00d2ff]"> GUÍA</span>
									</span>
								</a>
							</div>

							<div className="hidden lg:flex items-center space-x-6">
								<a
									href="/"
									className={`relative transition cursor-pointer ${isActive('/')
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
									className={`relative transition cursor-pointer ${isActive('/noticias')
										? 'text-[#00d2ff] font-semibold'
										: 'text-[#a0a0a0] hover:text-[#00d2ff]'
										}`}
								>
									{t('nav.news')}
									{isActive('/noticias') && (
										<span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00d2ff]"></span>
									)}
								</a>

								<div className="relative group">
									<span className="text-[#a0a0a0] cursor-not-allowed opacity-60">
										{t('nav.guides')}
									</span>
									<span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-[#0b0d12] text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
										{t('nav.comingSoon')}
									</span>
								</div>

								<a
									href="/mods"
									className={`relative transition cursor-pointer ${isActive('/mods')
										? 'text-[#00d2ff] font-semibold'
										: 'text-[#a0a0a0] hover:text-[#00d2ff]'
										}`}
								>
									{t('nav.mods')}
									{isActive('/mods') && (
										<span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00d2ff]"></span>
									)}
								</a>

								<div className="relative group">
									<span className="text-[#a0a0a0] cursor-not-allowed opacity-60">
										{t('nav.serverList')}
									</span>
									<span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-[#0b0d12] text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
										{t('nav.comingSoon')}
									</span>
								</div>

								<a
									href="/bugs"
									className={`relative transition cursor-pointer ${isActive('/bugs')
										? 'text-[#00d2ff] font-semibold'
										: 'text-[#a0a0a0] hover:text-[#00d2ff]'
										}`}
								>
									{t('nav.bugs')}
									{isActive('/bugs') && (
										<span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00d2ff]"></span>
									)}
								</a>
							</div>

							<div className="flex items-center space-x-2 md:space-x-4 relative z-50">
								<LanguageSelector />

								<div className="hidden md:flex items-center justify-center">
									{!isLoaded ? (
										hadSession ? (
											<div className="bg-white/5 rounded-full animate-pulse w-10 h-10"></div>
										) : (
											<div className="bg-white/5 rounded-lg animate-pulse h-10 w-28"></div>
										)
									) : (
										<>
											<SignedOut>
												<SignInButton mode="modal">
													<button className="bg-gradient-to-r from-[#00d2ff] to-[#0099cc] hover:from-[#0099cc] hover:to-[#00d2ff] text-[#0b0d12] px-6 md:px-8 py-2 rounded-lg font-bold transition cursor-pointer">
														{t('auth.login')}
													</button>
												</SignInButton>
											</SignedOut>
											<SignedIn>
												<UserButton
													appearance={{
														elements: {
															avatarBox: 'w-10 h-10 ring-2 ring-[#00d2ff]/50 hover:ring-[#00d2ff]',
															userButtonPopoverCard: 'bg-[#0b0d12]/95 backdrop-blur-xl border border-white/10',
															userButtonPopoverActionButton: 'hover:bg-white/5',
															userButtonPopoverActionButtonText: 'text-gray-300',
															userButtonPopoverActionButtonIcon: 'text-gray-400',
															userButtonPopoverFooter: 'hidden',
														}
													}}
												/>
											</SignedIn>
										</>
									)}
								</div>

								<button
									onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
									className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition cursor-pointer"
									aria-label="Toggle menu"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										{mobileMenuOpen ? (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										) : (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 6h16M4 12h16M4 18h16"
											/>
										)}
									</svg>
								</button>
							</div>
						</div>

						{mobileMenuOpen && (
							<div className="lg:hidden mt-4 pt-4 border-t border-white/10 animate-fadeIn">
								<div className="flex flex-col space-y-4">
									<a
										href="/"
										onClick={closeMobileMenu}
										className={`transition cursor-pointer py-2 ${isActive('/')
											? 'text-[#00d2ff] font-semibold'
											: 'text-[#a0a0a0] hover:text-[#00d2ff]'
											}`}
									>
										{t('nav.home')}
									</a>

									<a
										href="/noticias"
										onClick={closeMobileMenu}
										className={`transition cursor-pointer py-2 ${isActive('/noticias')
											? 'text-[#00d2ff] font-semibold'
											: 'text-[#a0a0a0] hover:text-[#00d2ff]'
											}`}
									>
										{t('nav.news')}
									</a>

									<div className="flex items-center justify-between py-2">
										<span className="text-[#a0a0a0] opacity-60">
											{t('nav.guides')}
										</span>
										<span className="bg-yellow-500/90 text-[#0b0d12] text-xs font-bold px-2 py-0.5 rounded">
											{t('nav.comingSoon')}
										</span>
									</div>

									<a
										href="/mods"
										onClick={closeMobileMenu}
										className={`transition cursor-pointer py-2 ${isActive('/mods')
											? 'text-[#00d2ff] font-semibold'
											: 'text-[#a0a0a0] hover:text-[#00d2ff]'
											}`}
									>
										{t('nav.mods')}
									</a>

									<div className="flex items-center justify-between py-2">
										<span className="text-[#a0a0a0] opacity-60">
											{t('nav.serverList')}
										</span>
										<span className="bg-yellow-500/90 text-[#0b0d12] text-xs font-bold px-2 py-0.5 rounded">
											{t('nav.comingSoon')}
										</span>
									</div>

									<a
										href="/bugs"
										onClick={closeMobileMenu}
										className={`transition cursor-pointer py-2 ${isActive('/bugs')
											? 'text-[#00d2ff] font-semibold'
											: 'text-[#a0a0a0] hover:text-[#00d2ff]'
											}`}
									>
										{t('nav.bugs')}
									</a>

									<div className="pt-4 border-t border-white/10">
										{!isLoaded ? (
											hadSession ? (
												<div className="flex items-center justify-center">
													<div className="bg-white/5 rounded-full animate-pulse w-12 h-12"></div>
												</div>
											) : (
												<div className="bg-white/5 w-full rounded-lg animate-pulse h-10"></div>
											)
										) : (
											<>
												<SignedOut>
													<SignInButton mode="modal">
														<button className="w-full bg-gradient-to-r from-[#00d2ff] to-[#0099cc] hover:from-[#0099cc] hover:to-[#00d2ff] text-[#0b0d12] px-6 py-2 rounded-lg font-bold transition cursor-pointer">
															{t('auth.login')}
														</button>
													</SignInButton>
												</SignedOut>
												<SignedIn>
													<div className="flex items-center justify-center">
														<UserButton
															appearance={{
																elements: {
																	avatarBox: 'w-12 h-12 ring-2 ring-[#00d2ff]/50',
																	userButtonPopoverCard: 'bg-[#0b0d12]/95 backdrop-blur-xl border border-white/10',
																	userButtonPopoverActionButton: 'hover:bg-white/5',
																	userButtonPopoverActionButtonText: 'text-gray-300',
																	userButtonPopoverActionButtonIcon: 'text-gray-400',
																	userButtonPopoverFooter: 'hidden',
																}
															}}
														/>
													</div>
												</SignedIn>
											</>
										)}
									</div>
								</div>
							</div>
						)}
					</div>

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
