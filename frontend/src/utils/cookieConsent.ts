export type CookieConsent = {
	analytics: boolean;
	ads: boolean;
	updatedAt: string;
};

const STORAGE_KEY = 'cookieConsent';

export function getCookieConsent(): CookieConsent | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as CookieConsent;
	} catch {
		return null;
	}
}

export function setCookieConsent(consent: Omit<CookieConsent, 'updatedAt'>) {
	const payload: CookieConsent = {
		...consent,
		updatedAt: new Date().toISOString(),
	};
	localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	return payload;
}

export function clearCookieConsent() {
	localStorage.removeItem(STORAGE_KEY);
}
