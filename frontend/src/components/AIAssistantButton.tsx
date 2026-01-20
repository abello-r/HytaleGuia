import { useTranslation } from 'react-i18next';

interface AIAssistantButtonProps {
	onClick: () => void;
}

export default function AIAssistantButton({ onClick }: AIAssistantButtonProps) {
	const { t } = useTranslation();

	return (
		<button
			onClick={onClick}
			className="fixed top-[calc(20%+80px)] right-0 z-50 group"
		>
			<div className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-r-0 border-white/20 transition-all duration-300 rounded-l-2xl shadow-2xl pl-3 pr-3 py-3 hover:pr-4 cursor-pointer relative">
				<img
					src="/ia.png"
					alt="AI Assistant"
					className="w-8 h-8 object-cover scale-x-[-1]"
				/>

				{/* Tooltip al hover */}
				<div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#0b0d12] text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
					{t('aiAssistant.tooltip')}
				</div>
			</div>
		</button>
	);
}
