import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Message {
	id: string;
	type: 'user' | 'ai';
	content: string;
}

interface ChatContextType {
	messages: Message[];
	addMessage: (content: string, type: 'user' | 'ai') => void;
	clearMessages: () => void;
	hasMessages: boolean;
	messageCount: number;
	maxMessages: number;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'hytale_chat_session';
const MAX_MESSAGES = 50;

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
	const [messages, setMessages] = useState<Message[]>(() => {
		// Load messages from sessionStorage on mount
		if (typeof window !== 'undefined') {
			try {
				const saved = sessionStorage.getItem(STORAGE_KEY);
				if (saved) {
					const parsed = JSON.parse(saved);
					if (Array.isArray(parsed)) {
						return parsed.slice(-MAX_MESSAGES);
					}
				}
			} catch (error) {
				console.warn('Failed to load chat session:', error);
				sessionStorage.removeItem(STORAGE_KEY);
			}
		}
		return [];
	});

	// Save messages to sessionStorage whenever they change
	useEffect(() => {
		if (messages.length > 0) {
			try {
				const messagesToSave = messages.slice(-MAX_MESSAGES);
				sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
			} catch (error) {
				console.error('Failed to save chat session:', error);
				if (error instanceof DOMException && error.name === 'QuotaExceededError') {
					clearMessages();
				}
			}
		} else {
			try {
				sessionStorage.removeItem(STORAGE_KEY);
			} catch (error) {
				console.error('Failed to clear storage:', error);
			}
		}
	}, [messages]);

	const addMessage = (content: string, type: 'user' | 'ai') => {
		// Sanitize: limit length and trim whitespace
		const sanitizedContent = content.trim().slice(0, 1000);

		if (!sanitizedContent) return;

		const newMessage: Message = {
			id: Date.now().toString(),
			type,
			content: sanitizedContent,
		};

		setMessages((prev) => {
			const updated = [...prev, newMessage];
			// Automatically limit to MAX_MESSAGES
			return updated.slice(-MAX_MESSAGES);
		});
	};

	const clearMessages = () => {
		setMessages([]);
		try {
			sessionStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.error('Failed to clear messages:', error);
		}
	};

	const value: ChatContextType = {
		messages,
		addMessage,
		clearMessages,
		hasMessages: messages.length > 0,
		messageCount: messages.length,
		maxMessages: MAX_MESSAGES,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Custom hook to use the chat context
export function useChatContext() {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error('useChatContext must be used within a ChatProvider');
	}
	return context;
}
