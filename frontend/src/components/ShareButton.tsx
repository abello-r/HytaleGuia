import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ShareButtonProps {
	title: string;
	text: string;
	url: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
	const { t } = useTranslation();
	const [showToast, setShowToast] = useState(false);

	const handleShare = async (e: React.MouseEvent) => {
		e.stopPropagation();
		copyToClipboard();
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(url).then(() => {
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);
		});
	};

	return (
		<>
			<button
				onClick={handleShare}
				className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00d2ff]/50 text-gray-400 hover:text-[#00d2ff] px-3 py-2 rounded-lg transition text-sm"
				title={t('news.share')}
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
				</svg>
				<span>{t('news.share')}</span>
			</button>

			{/* Toast notification */}
			{showToast && (
				<div className="fixed top-4 right-4 z-[9999] pointer-events-none animate-fadeIn">
					<div className="bg-[#1a1d24] backdrop-blur-xl border border-white/20 rounded-xl px-6 py-4 shadow-lg">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
								<svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div>
								<p className="text-white font-medium text-sm">
									{t('news.linkCopied')}
								</p>
								<p className="text-gray-400 text-xs">
									{t('news.linkCopiedDesc')}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

		</>
	);
}