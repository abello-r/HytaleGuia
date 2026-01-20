import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatContext } from '../context/ChatContext';

interface AIChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialQuery?: string;
}

export default function AIChatModal({ isOpen, onClose, initialQuery = '' }: AIChatModalProps) {
	const { t } = useTranslation();
	const {
		messages,
		addMessage,
		clearMessages,
		hasMessages,
	} = useChatContext();

	const [inputValue, setInputValue] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const hasProcessedInitialQuery = useRef(false);

	const suggestedQuestions = [
		t('aiChat.suggestions.crafting'),
		t('aiChat.suggestions.biomes'),
		t('aiChat.suggestions.prefabs'),
		t('aiChat.suggestions.combat'),
	];

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Focus input when modal opens & handle initial query
	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
			// Only process initial query once when opening fresh
			if (initialQuery && !hasProcessedInitialQuery.current) {
				handleSendMessage(initialQuery);
				hasProcessedInitialQuery.current = true;
			}
		} else {
			// Reset when modal closes if there was an initial query
			if (initialQuery) {
				hasProcessedInitialQuery.current = false;
			}
		}
	}, [isOpen, initialQuery]); // Removed hasMessages from dependencies

	// Close on ESC key
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};
		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, [isOpen, onClose]);

	const handleSendMessage = async (content: string = inputValue) => {
		if (!content.trim() || isTyping) return;

		// Add user message
		addMessage(content, 'user');
		setInputValue('');
		setIsTyping(true);

		// Simulate AI response (replace with actual API call in future)
		setTimeout(() => {
			const aiResponse = t('aiChat.devResponse', { query: content.trim() });
			addMessage(aiResponse, 'ai');
			setIsTyping(false);
		}, 1500);

		/**
		 * Future API implementation:
		 * 
		 * try {
		 *   const response = await fetch('/api/chat', {
		 *     method: 'POST',
		 *     body: JSON.stringify({ message: content }),
		 *   });
		 *   const data = await response.json();
		 *   addMessage(data.response, 'ai');
		 * } catch (error) {
		 *   addMessage(t('aiChat.errorResponse'), 'ai');
		 * } finally {
		 *   setIsTyping(false);
		 * }
		 */
	};

	const handleSuggestedQuestion = (question: string) => {
		handleSendMessage(question);
	};

	const handleClearChat = () => {
		clearMessages();
		hasProcessedInitialQuery.current = false;
		// Also notify parent to clear initial query if needed
		if (initialQuery) {
			onClose(); // Close and reset
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/20 backdrop-blur-md"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative w-full max-w-3xl h-[80vh] bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col">
				{/* Header - Minimalist */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d2ff]/20 to-[#0099cc]/20 backdrop-blur-xl border border-white/20 flex items-center justify-center">
							<img
								src="/ia.png"
								alt="Doge AI"
								className="w-6 h-6 object-cover"
							/>
						</div>
						<div>
							<h2 className="text-lg font-semibold text-white">{t('aiChat.title')}</h2>
							<p className="text-xs text-white/50">{t('aiChat.subtitle')}</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{hasMessages && (
							<button
								onClick={handleClearChat}
								className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 transition-all duration-200 flex items-center justify-center group cursor-pointer"
								title={t('aiChat.clearChat')}
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						)}
						<button
							onClick={onClose}
							className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-200 flex items-center justify-center group cursor-pointer"
						>
							<svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				{/* Messages Container */}
				<div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
					{!hasMessages ? (
						<div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
							<div className="relative">
								<div className="absolute inset-0 bg-[#00d2ff]/20 blur-3xl rounded-full"></div>
								<div className="relative w-16 h-16 bg-gradient-to-br from-[#00d2ff]/30 to-[#0099cc]/30 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
									<img
										src="/ia.png"
										alt="Doge AI"
										className="w-10 h-10 object-cover"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-xl font-semibold text-white">{t('aiChat.welcome')}</h3>
								<p className="text-sm text-white/60 max-w-md leading-relaxed">
									{t('aiChat.description')}
								</p>
							</div>

							{/* Suggested Questions - Minimalist Grid */}
							<div className="space-y-3 w-full max-w-xl">
								<p className="text-xs text-white/40 font-medium uppercase tracking-wider">{t('aiChat.suggestedQuestions')}</p>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
									{suggestedQuestions.map((question, index) => (
										<button
											key={index}
											onClick={() => handleSuggestedQuestion(question)}
											className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-[#00d2ff]/40 rounded-xl px-4 py-3 text-left text-sm text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
										>
											<span className="flex items-start gap-2">
												<span className="text-[#00d2ff] mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">→</span>
												<span>{question}</span>
											</span>
										</button>
									))}
								</div>
							</div>
						</div>
					) : (
						<>
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
								>
									<div
										className={`max-w-[75%] rounded-2xl px-3 py-2 ${
											message.type === 'user'
												? 'bg-gradient-to-r from-[#00d2ff] to-[#0099cc] text-[#0b0d12] shadow-lg shadow-[#00d2ff]/20'
												: 'bg-white/5 backdrop-blur-xl border border-white/10 text-white'
										}`}
									>
										{message.type === 'ai' && (
											<div className="flex items-center gap-2 mb-1.5 opacity-60">
												<img
													src="/ia.png"
													alt="Doge"
													className="w-3.5 h-3.5 object-cover"
												/>
												<span className="text-[10px] font-medium text-[#00d2ff]">Doge</span>
											</div>
										)}
										<p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
									</div>
								</div>
							))}

							{/* Typing Indicator - Minimalist */}
							{isTyping && (
								<div className="flex justify-start animate-fadeIn">
									<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-2">
										<div className="flex items-center gap-2">
											<img
												src="/ia.png"
												alt="Doge"
												className="w-3.5 h-3.5 object-cover opacity-60"
											/>
											<div className="flex gap-1">
												<span className="w-1.5 h-1.5 bg-[#00d2ff]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
												<span className="w-1.5 h-1.5 bg-[#00d2ff]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
												<span className="w-1.5 h-1.5 bg-[#00d2ff]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
											</div>
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</>
					)}
				</div>

				{/* Input Area - Minimalist */}
				<div className="border-t border-white/10 px-6 py-4 bg-white/5 backdrop-blur-xl">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSendMessage();
						}}
						className="flex items-center gap-2"
					>
						<div className="flex-1 relative">
							<input
								ref={inputRef}
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder={t('aiChat.placeholder')}
								maxLength={1000}
								className="w-full bg-white/5 backdrop-blur-sm border border-white/10 focus:border-[#00d2ff]/50 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-200"
								disabled={isTyping}
							/>
						</div>
						<button
							type="submit"
							disabled={!inputValue.trim() || isTyping}
							className="bg-gradient-to-r from-[#00d2ff] to-[#0099cc] hover:from-[#0099cc] hover:to-[#00d2ff] disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed text-[#0b0d12] disabled:text-white/40 w-10 h-10 rounded-xl font-bold transition-all duration-200 flex items-center justify-center shadow-lg shadow-[#00d2ff]/20 disabled:shadow-none group cursor-pointer"
						>
							<svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
							</svg>
						</button>
					</form>
					<p className="text-[10px] text-white/30 mt-2 text-center">
						{t('aiChat.hint')}
					</p>
				</div>
			</div>
		</div>
	);
}
