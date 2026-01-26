import { useHytaleStatus } from '../hooks/useHytaleAPI';
import { useTranslation } from 'react-i18next';

export default function HytaleStatusBadge() {
	const { isOnline, loading } = useHytaleStatus();
	const { t } = useTranslation();

	if (loading) {
		return (
			<div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 px-4 h-10 rounded-[8px] text-sm font-medium">
				<span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
				<span>{t('hytaleStatus.checking')}</span>
			</div>
		);
	}

	return (
		<div className={`inline-flex items-center gap-2 backdrop-blur-sm border px-4 h-10 rounded-[8px] text-sm font-medium transition-all duration-300 ${
			isOnline 
				? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
				: 'bg-rose-400/10 border-rose-400/30 text-rose-400'
		}`}>
			<span className={`w-2 h-2 rounded-full ${
				isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
			}`}></span>
			<span>{isOnline ? t('hytaleStatus.online') : t('hytaleStatus.offline')}</span>
		</div>
	);
}
