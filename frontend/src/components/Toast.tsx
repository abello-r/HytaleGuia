import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
	message: string
	type?: ToastType
	duration?: number
	onClose: () => void
}

const ICONS: Record<ToastType, JSX.Element> = {
	success: (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
		</svg>
	),
	error: (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
		</svg>
	),
	info: (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
}

const COLORS: Record<ToastType, { bg: string; border: string; text: string; bar: string }> = {
	success: {
		bg: 'bg-emerald-500/20',
		border: 'border-emerald-500/30',
		text: 'text-emerald-400',
		bar: 'from-emerald-500 to-emerald-400',
	},
	error: {
		bg: 'bg-red-500/20',
		border: 'border-red-500/30',
		text: 'text-red-400',
		bar: 'from-red-500 to-red-400',
	},
	info: {
		bg: 'bg-[#00d2ff]/20',
		border: 'border-[#00d2ff]/30',
		text: 'text-[#00d2ff]',
		bar: 'from-[#00d2ff] to-[#0099cc]',
	},
}

export default function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
	const [isVisible, setIsVisible] = useState(false)
	const [progress, setProgress] = useState(100)
	const colors = COLORS[type]

	useEffect(() => {
		setIsVisible(true)
		setProgress(100)

		const startTime = Date.now()
		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime
			const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
			setProgress(remaining)

			if (remaining <= 0) {
				clearInterval(interval)
				setIsVisible(false)
				setTimeout(onClose, 300)
			}
		}, 50)

		return () => clearInterval(interval)
	}, [duration, onClose])

	return (
		<div
			className={`fixed top-4 right-4 z-[150] transition-all duration-300 ${
				isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
			}`}
		>
			<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl min-w-[300px] max-w-[400px]">
				<div className="p-4 flex items-center gap-3">
					<div className={`w-10 h-10 rounded-xl ${colors.bg} backdrop-blur-sm border ${colors.border} flex items-center justify-center ${colors.text}`}>
						{ICONS[type]}
					</div>
					<p className="flex-1 text-white font-medium text-sm">
						{message}
					</p>
					<button
						onClick={() => { setIsVisible(false); setTimeout(onClose, 300) }}
						className="text-white/40 hover:text-white transition cursor-pointer p-1"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="h-1 bg-white/5">
					<div 
						className={`h-full bg-gradient-to-r ${colors.bar} transition-all duration-50 ease-linear`}
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		</div>
	)
}