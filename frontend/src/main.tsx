import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { esES, enUS, frFR, itIT, ptPT } from '@clerk/localizations'
import { useTranslation } from 'react-i18next'
import './index.css'
import './i18n'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
	throw new Error('Missing Publishable Key')
}

const clerkLocales: Record<string, typeof esES> = {
	es: esES,
	en: enUS,
	fr: frFR,
	it: itIT,
	pt: ptPT,
}

function ClerkWithLocale({ children }: { children: React.ReactNode }) {
	const { i18n } = useTranslation()
	const locale = clerkLocales[i18n.language] || esES

	return (
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={locale}>
			{children}
		</ClerkProvider>
	)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ClerkWithLocale>
			<App />
		</ClerkWithLocale>
	</StrictMode>
)
