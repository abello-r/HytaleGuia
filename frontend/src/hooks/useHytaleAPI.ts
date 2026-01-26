import { useState, useEffect } from 'react';

interface HytaleStatus {
	isOnline: boolean;
	lastChecked: Date;
	loading: boolean;
}

interface HytaleBlogPost {
	slug: string;
	title: string;
	coverImage: string;
	date: string;
	author: {
		name: string;
		slug: string;
	};
	excerpt: string;
	loading: boolean;
}

const API_BASE = '/api/hytale';
const CACHE_DURATION = 5 * 60 * 1000;

export function useHytaleStatus() {
	const [status, setStatus] = useState<HytaleStatus>({
		isOnline: true,
		lastChecked: new Date(),
		loading: true
	});

	useEffect(() => {
		const checkStatus = async () => {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);

				const response = await fetch(`${API_BASE}/status`, {
					method: 'GET',
					signal: controller.signal
				});

				clearTimeout(timeoutId);

				if (response.ok) {
					const data = await response.json();
					setStatus({
						isOnline: data.data?.isOnline ?? true,
						lastChecked: new Date(),
						loading: false
					});
				} else {
					setStatus({
						isOnline: true,
						lastChecked: new Date(),
						loading: false
					});
				}
			} catch (error) {
				console.error('Error checking Hytale status:', error);
				setStatus({
					isOnline: true,
					lastChecked: new Date(),
					loading: false
				});
			}
		};

		const initialTimeout = setTimeout(checkStatus, 1000);
		const interval = setInterval(checkStatus, CACHE_DURATION);

		return () => {
			clearTimeout(initialTimeout);
			clearInterval(interval);
		};
	}, []);

	return status;
}

export function useLatestHytalePost() {
	const [post, setPost] = useState<HytaleBlogPost | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLatestPost = async () => {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000);

				const response = await fetch(`${API_BASE}/blog/latest`, {
					signal: controller.signal
				});
				
				clearTimeout(timeoutId);

				if (!response.ok) {
					throw new Error('Failed to fetch blog post');
				}

				const data = await response.json();

				if (data.success && data.data) {
					const postData = data.data;
					
					setPost({
						slug: postData.slug,
						title: postData.title,
						coverImage: postData.coverImage || '',
						date: postData.date,
						author: {
							name: postData.author || 'Hytale Team',
							slug: 'hytale-team'
						},
						excerpt: postData.excerpt || '',
						loading: false
					});
				}

				setLoading(false);
			} catch (error) {
				console.error('Error fetching latest Hytale post:', error);
				setLoading(false);
			}
		};

		fetchLatestPost();
	}, []);

	return { post, loading };
}
