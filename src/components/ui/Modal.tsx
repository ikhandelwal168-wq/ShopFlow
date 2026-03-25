import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101b31b0] p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div className="w-full max-w-5xl rounded-[28px] border border-[#dfe6f2] bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e8edf5] px-8 py-7 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-[#1f2b46] dark:text-slate-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#9aabc3] transition hover:bg-[#f4f7fc] hover:text-[#6e809d] dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X size={34} />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
