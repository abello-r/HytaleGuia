import { useState, useEffect } from 'react';

interface Message {
	id: string;
	type: 'user' | 'ai';
	content: string;
}

const STORAGE_KEY = 'hytale_chat_session';
const MAX_MESSAGES = 50;

/**
 * Custom hook for chat storage management
 * Currently uses sessionStorage (temporary, GDPR compliant)
 * Easy to migrate to backend API in the future
 */
export function useChatStorage() {
	const [messages, setMessages] = useState<Message[]>(() => {
		// Load messages from sessionStorage on mount
		if (typeof window !== 'undefined') {
			try {
				const saved = sessionStorage.getItem(STORAGE_KEY);
				if (saved) {
					const parsed = JSON.parse(saved);
					// Validate data structure
					if (Array.isArray(parsed)) {
						// Keep only last MAX_MESSAGES
						return parsed.slice(-MAX_MESSAGES);
					}
				}
			} catch (error) {
				console.warn('Failed to load chat session:', error);
				// Clear corrupted data
				sessionStorage.removeItem(STORAGE_KEY);
			}
		}
		return [];
	});

	// Save messages to sessionStorage whenever they change
	useEffect(() => {
		if (messages.length > 0) {
			try {
				// Keep only last MAX_MESSAGES to prevent bloat
				const messagesToSave = messages.slice(-MAX_MESSAGES);
				sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
			} catch (error) {
				console.error('Failed to save chat session:', error);
				// If quota exceeded, clear all messages
				if (error instanceof DOMException && error.name === 'QuotaExceededError') {
					clearMessages();
				}
			}
		} else {
			// Remove from storage if no messages
			try {
				sessionStorage.removeItem(STORAGE_KEY);
			} catch (error) {
				console.error('Failed to clear storage:', error);
			}
		}
	}, [messages]);

	/**
	 * Add a new message to the chat
	 * Automatically limits to MAX_MESSAGES
	 * Sanitizes content (length limit + trim)
	 */
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

	/**
	 * Clear all messages from state and storage
	 */
	const clearMessages = () => {
		setMessages([]);
		try {
			sessionStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.error('Failed to clear messages:', error);
		}
	};

	/**
	 * Get message count
	 */
	const messageCount = messages.length;

	/**
	 * Check if chat has messages
	 */
	const hasMessages = messages.length > 0;

	return {
		messages,
		addMessage,
		clearMessages,
		messageCount,
		hasMessages,
		maxMessages: MAX_MESSAGES,
	};
}

/**
 * Future migration path to backend API:
 * 
 * export function useChatStorage() {
 *   // ... same interface ...
 *   
 *   const addMessage = async (content: string, type: 'user' | 'ai') => {
 *     const sanitizedContent = content.trim().slice(0, 1000);
 *     if (!sanitizedContent) return;
 *     
 *     // Save to backend
 *     const newMessage = await api.chat.addMessage({
 *       content: sanitizedContent,
 *       type,
 *     });
 *     
 *     setMessages(prev => [...prev, newMessage]);
 *   };
 *   
 *   // ... rest stays the same ...
 * }
 */