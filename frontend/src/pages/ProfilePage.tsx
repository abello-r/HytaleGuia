import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscordButton from '../components/DiscordButton';

export default function ProfilePage() {
	const { t } = useTranslation();
	const { isLoaded, isSignedIn, user } = useUser();

	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-[#0b0d12] flex flex-col relative">
				<div
					className="absolute inset-0 bg-no-repeat bg-top"
					style={{ backgroundImage: 'url("/base.jpg")', backgroundSize: '100% auto' }}
				>
					<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0b0d12]"></div>
				</div>

				<div className="relative z-10 flex flex-col min-h-screen">
					<Header />
					<main className="flex-1 container mx-auto px-4 py-24">
						<div className="max-w-4xl mx-auto">
							<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 animate-pulse">
								<div className="flex items-center gap-6 mb-8">
									<div className="w-24 h-24 rounded-full bg-white/10"></div>
									<div className="space-y-3">
										<div className="h-8 w-48 bg-white/10 rounded-lg"></div>
										<div className="h-4 w-32 bg-white/10 rounded"></div>
									</div>
								</div>

								<div className="space-y-6">
									<div className="bg-white/5 border border-white/10 rounded-xl p-6">
										<div className="h-6 w-40 bg-white/10 rounded mb-4"></div>
										<div className="space-y-3">
											<div className="flex justify-between">
												<div className="h-4 w-24 bg-white/10 rounded"></div>
												<div className="h-4 w-32 bg-white/10 rounded"></div>
											</div>
											<div className="flex justify-between">
												<div className="h-4 w-20 bg-white/10 rounded"></div>
												<div className="h-4 w-28 bg-white/10 rounded"></div>
											</div>
											<div className="flex justify-between">
												<div className="h-4 w-28 bg-white/10 rounded"></div>
												<div className="h-4 w-24 bg-white/10 rounded"></div>
											</div>
										</div>
									</div>

									<div className="bg-white/5 border border-white/10 rounded-xl p-6">
										<div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
										<div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
											{[...Array(6)].map((_, i) => (
												<div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5">
													<div className="w-8 h-8 bg-white/10 rounded mb-2"></div>
													<div className="h-3 w-12 bg-white/10 rounded"></div>
												</div>
											))}
										</div>
									</div>

									<div className="bg-white/5 border border-white/10 rounded-xl p-6">
										<div className="h-6 w-28 bg-white/10 rounded mb-4"></div>
										<div className="h-4 w-48 bg-white/10 rounded"></div>
									</div>
								</div>
							</div>
						</div>
					</main>
					<Footer />
				</div>
			</div>
		);
	}

	if (!isSignedIn) {
		return <Navigate to="/" replace />;
	}

	const achievements = [
		{
			id: 'early_adopter',
			icon: (
				<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
				</svg>
			),
			unlocked: true,
		},
		{
			id: 'first_comment',
			icon: (
				<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
				</svg>
			),
			unlocked: false,
		},
		{
			id: 'mod_hunter',
			icon: (
				<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M21 6H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM11 13H6v-2h5v2zm7 0h-5v-2h5v2z"/>
				</svg>
			),
			unlocked: false,
		},
		{
			id: 'bug_reporter',
			icon: (
				<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 8h-1.81a5.99 5.99 0 0 0-1.82-2.43l1.92-1.92-1.41-1.41-2.2 2.2a5.86 5.86 0 0 0-3.36 0l-2.2-2.2-1.41 1.41 1.92 1.92A5.99 5.99 0 0 0 6.81 8H5v2h1.09a6.08 6.08 0 0 0 0 4H5v2h1.81c.45.72 1.01 1.34 1.67 1.85L7 19.33V22h2v-2.12c.61.18 1.25.3 1.91.35V22h2v-1.77a6.03 6.03 0 0 0 1.91-.35V22h2v-2.67l-1.48-1.48A5.96 5.96 0 0 0 17.19 16H19v-2h-1.09a6.08 6.08 0 0 0 0-4H19V8zm-7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
				</svg>
			),
			unlocked: false,
		},
		{
			id: 'news_reader',
			icon: (
				<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14H5v-2h7v2zm5-4H5v-2h12v2zm0-4H5V7h12v2z"/>
				</svg>
			),
			unlocked: false,
		},
		{
			id: 'community_member',
			icon: (
				<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
				</svg>
			),
			unlocked: false,
		},
	];

	return (
		<div className="min-h-screen bg-[#0b0d12] flex flex-col relative">
			<div
				className="absolute inset-0 bg-no-repeat bg-top"
				style={{ backgroundImage: 'url("/base.jpg")', backgroundSize: '100% auto' }}
			>
				<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0b0d12]"></div>
			</div>

			<div className="relative z-10 flex flex-col min-h-screen">
				<Header />
				<DiscordButton />

			<main className="flex-1 container mx-auto px-4 py-24">
				<div className="max-w-4xl mx-auto">
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
						<div className="flex items-center gap-6 mb-8">
							<img
								src={user.imageUrl}
								alt={user.fullName || 'User'}
								className="w-24 h-24 rounded-full ring-4 ring-[#00d2ff]/50"
							/>
							<div>
								<h1 className="text-3xl font-bold text-white mb-2">
									{t('profile.welcome')}, {user.firstName}!
								</h1>
								<p className="text-gray-400">
									{user.primaryEmailAddress?.emailAddress}
								</p>
							</div>
						</div>

						<div className="space-y-6">
							<div className="bg-white/5 border border-white/10 rounded-xl p-6">
								<h2 className="text-xl font-bold text-white mb-4">
									{t('profile.accountInfo')}
								</h2>
								<div className="space-y-3 text-gray-300">
									<div className="flex justify-between">
										<span className="text-gray-400">{t('profile.fullName')}:</span>
										<span>{user.fullName || 'N/A'}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">{t('profile.username')}:</span>
										<span>{user.username || 'N/A'}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">{t('profile.memberSince')}:</span>
										<span>{new Date(user.createdAt!).toLocaleDateString()}</span>
									</div>
								</div>
							</div>

							<div className="bg-white/5 border border-white/10 rounded-xl p-6">
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-xl font-bold text-white">
										{t('profile.achievements.title')}
									</h2>
									<span className="text-sm text-gray-400">
										{achievements.filter(a => a.unlocked).length}/{achievements.length}
									</span>
								</div>

								<div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
									{achievements.map((achievement) => (
										<div
											key={achievement.id}
											className={`relative group flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
												achievement.unlocked
													? 'bg-[#00d2ff]/10 border-[#00d2ff]/30 hover:border-[#00d2ff]/50'
													: 'bg-white/5 border-white/10 opacity-50 grayscale'
											}`}
										>
											<div className={`mb-2 ${
												achievement.unlocked ? 'text-[#00d2ff]' : 'text-gray-500'
											}`}>
												{achievement.icon}
											</div>
											<span className={`text-xs text-center font-medium ${
												achievement.unlocked ? 'text-white' : 'text-gray-500'
											}`}>
												{t(`profile.achievements.${achievement.id}.name`)}
											</span>

											<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#0b0d12] border border-white/10 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
												{t(`profile.achievements.${achievement.id}.description`)}
											</div>

											{achievement.unlocked && (
												<div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00d2ff] rounded-full flex items-center justify-center">
													<span className="text-[10px] text-[#0b0d12]">✓</span>
												</div>
											)}
										</div>
									))}
								</div>
							</div>

							<div className="bg-white/5 border border-white/10 rounded-xl p-6">
								<h2 className="text-xl font-bold text-white mb-4">
									{t('profile.activity')}
								</h2>
								<p className="text-gray-400">
									{t('profile.comingSoon')}
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
			</div>
		</div>
	);
}
