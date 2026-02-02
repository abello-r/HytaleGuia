import { useRef, useState, useCallback, useEffect, type JSX } from 'react'
import { useTranslation } from 'react-i18next'

interface MarkdownEditorProps {
	value: string
	onChange: (value: string) => void
	maxLength?: number
	rows?: number
	placeholder?: string
}

interface ToolbarButton {
	id: string
	icon: JSX.Element
	action: 'wrap' | 'prefix' | 'insert'
	before?: string
	after?: string
	prefix?: string
	insert?: string
	shortcut?: string
}

function Tooltip({ children, text, shortcut }: { children: React.ReactNode; text: string; shortcut?: string }) {
	return (
		<div className="relative group">
			{children}
			<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1a1d24] border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
				<span>{text}</span>
				{shortcut && <span className="ml-2 text-gray-400 font-mono">{shortcut}</span>}
				<div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1a1d24]" />
			</div>
		</div>
	)
}

function EditorToast({ message, onHide }: { message: string; onHide: () => void }) {
	useEffect(() => {
		const timer = setTimeout(onHide, 1500)
		return () => clearTimeout(timer)
	}, [onHide])

	return (
		<div className="absolute top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-medium rounded-lg z-50 animate-fadeIn">
			✓ {message}
		</div>
	)
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
	{ id: 'bold', icon: <span className="font-bold">B</span>, action: 'wrap', before: '**', after: '**', shortcut: 'Ctrl+B' },
	{ id: 'italic', icon: <span className="italic">I</span>, action: 'wrap', before: '_', after: '_', shortcut: 'Ctrl+I' },
	{ id: 'strikethrough', icon: <span className="line-through">S</span>, action: 'wrap', before: '~~', after: '~~' },
	{ id: 'heading', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>, action: 'prefix', prefix: '## ' },
	{ id: 'quote', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" /></svg>, action: 'prefix', prefix: '> ' },
	{ id: 'code', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, action: 'wrap', before: '`', after: '`' },
	{ id: 'codeblock', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, action: 'wrap', before: '```\n', after: '\n```' },
	{ id: 'link', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>, action: 'insert', insert: '[texto](url)', shortcut: 'Ctrl+K' },
	{ id: 'image', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, action: 'insert', insert: '![alt](url)' },
	{ id: 'list', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>, action: 'prefix', prefix: '- ' },
	{ id: 'orderedList', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h14M7 12h14M7 4h14M3 20h.01M3 12h.01M3 4h.01" /></svg>, action: 'prefix', prefix: '1. ' },
	{ id: 'divider', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>, action: 'insert', insert: '\n---\n' },
]

export function renderMarkdownSafe(text: string): string {
	if (!text) return ''
	let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
	html = html
		.replace(/^### (.*$)/gm, '</p><h3 class="text-xl font-bold text-white mt-8 mb-4">$1</h3><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/^## (.*$)/gm, '</p><h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/^# (.*$)/gm, '</p><h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-white"><em>$1</em></strong>')
		.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
		.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
		.replace(/___(.*?)___/g, '<strong class="font-bold text-white"><em>$1</em></strong>')
		.replace(/__(.*?)__/g, '<strong class="font-bold text-white">$1</strong>')
		.replace(/_(.*?)_/g, '<em class="italic text-gray-300">$1</em>')
		.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500">$1</del>')
		.replace(/```(\w*)\n([\s\S]*?)```/g, '</p><pre class="bg-black/30 border border-white/10 p-4 rounded-xl my-4 overflow-x-auto"><code class="text-sm font-mono text-[#00d2ff]">$2</code></pre><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/```([\s\S]*?)```/g, '</p><pre class="bg-black/30 border border-white/10 p-4 rounded-xl my-4 overflow-x-auto"><code class="text-sm font-mono text-[#00d2ff]">$1</code></pre><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-[#00d2ff] text-sm font-mono">$1</code>')
		.replace(/^&gt; (.*$)/gm, '</p><blockquote class="border-l-4 border-[#00d2ff]/50 pl-4 my-4 text-gray-300 italic bg-white/5 py-2 pr-4 rounded-r-lg">$1</blockquote><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/^---$/gm, '</p><hr class="border-white/10 my-8" /><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-xl my-4 border border-white/10" loading="lazy" />')
		.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" class="text-[#00d2ff] hover:text-[#00b8e6] underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>')
		.replace(/^- (.*$)/gm, '<li class="ml-6 list-disc text-gray-300 mb-1">$1</li>')
		.replace(/^\* (.*$)/gm, '<li class="ml-6 list-disc text-gray-300 mb-1">$1</li>')
		.replace(/^\d+\. (.*$)/gm, '<li class="ml-6 list-decimal text-gray-300 mb-1">$1</li>')
		.replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-4">').replace(/\n/g, '<br />')
	html = `<p class="text-gray-300 leading-relaxed mb-4">${html}</p>`
	return html.replace(/<p class="text-gray-300 leading-relaxed mb-4"><\/p>/g, '').replace(/<p class="text-gray-300 leading-relaxed mb-4"><br \/><\/p>/g, '').replace(/<p class="text-gray-300 leading-relaxed mb-4">\s*<\/p>/g, '')
}

export default function MarkdownEditor({ value, onChange, maxLength = 20000, rows = 15, placeholder }: MarkdownEditorProps) {
	const { t } = useTranslation()
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [showPreview, setShowPreview] = useState(false)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [toast, setToast] = useState<string | null>(null)

	const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
	const showFeedback = useCallback((msg: string) => setToast(msg), [])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!textareaRef.current || document.activeElement !== textareaRef.current) return
			if (e.ctrlKey || e.metaKey) {
				const button = TOOLBAR_BUTTONS.find(b => 
					(e.key.toLowerCase() === 'b' && b.id === 'bold') ||
					(e.key.toLowerCase() === 'i' && b.id === 'italic') ||
					(e.key.toLowerCase() === 'k' && b.id === 'link')
				)
				if (button) { e.preventDefault(); applyFormat(button) }
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [value])

	const applyFormat = useCallback((button: ToolbarButton) => {
		const textarea = textareaRef.current
		if (!textarea) return

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const selectedText = value.substring(start, end)
		let newValue = value, newStart = start, newEnd = end

		if (button.action === 'wrap') {
			const before = button.before || '', after = button.after || ''
			newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)
			newStart = start + before.length
			newEnd = newStart + selectedText.length
		} else if (button.action === 'prefix') {
			const prefix = button.prefix || ''
			const lineStart = value.lastIndexOf('\n', start - 1) + 1
			newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart)
			newStart = start + prefix.length
			newEnd = end + prefix.length
		} else if (button.action === 'insert') {
			const insert = button.insert || ''
			newValue = value.substring(0, start) + insert + value.substring(end)
			newStart = start + insert.length
			newEnd = newStart
		}

		if (newValue.length <= maxLength) {
			onChange(newValue)
			showFeedback(t(`guides.editor.toolbar.${button.id}`))
			setTimeout(() => { textarea.focus(); textarea.setSelectionRange(newStart, newEnd) }, 10)
		}
	}, [value, maxLength, onChange, showFeedback, t])

	const containerClass = isFullscreen ? 'fixed inset-0 z-[100] bg-[#0b0d12] p-4 flex flex-col' : 'space-y-2 relative'

	return (
		<div className={containerClass}>
			{toast && <EditorToast message={toast} onHide={() => setToast(null)} />}

			<div className={`flex items-center justify-between gap-2 p-2 bg-white/5 border border-white/10 ${isFullscreen ? 'rounded-xl' : 'rounded-t-xl'}`}>
				<div className="flex items-center gap-1 flex-wrap">
					{TOOLBAR_BUTTONS.map((button) => (
						<Tooltip key={button.id} text={t(`guides.editor.toolbar.${button.id}`)} shortcut={button.shortcut}>
							<button type="button" onClick={() => applyFormat(button)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer">
								{button.icon}
							</button>
						</Tooltip>
					))}
				</div>

				<div className="flex items-center gap-2">
					<Tooltip text={isFullscreen ? t('guides.editor.toolbar.exitFullscreen') : t('guides.editor.toolbar.fullscreen')}>
						<button type="button" onClick={() => setIsFullscreen(!isFullscreen)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer">
							{isFullscreen ? (
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
							) : (
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
							)}
						</button>
					</Tooltip>
					<button type="button" onClick={() => setShowPreview(!showPreview)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${showPreview ? 'bg-[#00d2ff] text-[#0b0d12]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
						{showPreview ? t('guides.editor.toolbar.edit') : t('guides.editor.toolbar.preview')}
					</button>
				</div>
			</div>

			<div className={isFullscreen ? 'flex-1 min-h-0' : ''}>
				{showPreview ? (
					<div className={`bg-white/5 border border-white/10 ${isFullscreen ? 'rounded-xl h-full overflow-auto' : 'border-t-0 rounded-b-xl'} px-4 py-3 text-gray-300 max-w-none ${isFullscreen ? '' : 'min-h-[300px]'}`} dangerouslySetInnerHTML={{ __html: renderMarkdownSafe(value) }} />
				) : (
					<textarea ref={textareaRef} value={value} onChange={(e) => { if (e.target.value.length <= maxLength) onChange(e.target.value) }} rows={isFullscreen ? undefined : rows} placeholder={placeholder} className={`w-full bg-white/5 border border-white/10 ${isFullscreen ? 'rounded-xl h-full' : 'border-t-0 rounded-b-xl'} px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition resize-none font-mono text-sm`} style={isFullscreen ? { height: 'calc(100% - 0px)' } : undefined} />
				)}
			</div>

			<div className={`flex items-center justify-between text-xs text-gray-500 ${isFullscreen ? 'pt-2' : ''}`}>
				<div className="flex items-center gap-4">
					<span>{t('guides.editor.markdownSupported')}</span>
					<span className="text-gray-600">|</span>
					<span>{wordCount} {t('guides.editor.words')}</span>
				</div>
				<span className={value.length > maxLength * 0.9 ? 'text-yellow-400' : ''}>{value.length.toLocaleString()} / {maxLength.toLocaleString()} {t('guides.editor.characters')}</span>
			</div>

			<style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.15s ease-out; }`}</style>
		</div>
	)
}
