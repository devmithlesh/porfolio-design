import type { RefObject, ReactNode } from 'react'

interface ModalShellProps {
  children: ReactNode
  onClose: () => void
  panelRef?: RefObject<HTMLDivElement>
  panelClassName?: string
}

export function ModalShell({
  children,
  onClose,
  panelRef,
  panelClassName = 'game-panel w-full max-w-lg p-6 md:p-8',
}: ModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-default"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div ref={panelRef} className={panelClassName} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function ModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="text-gray-400 hover:text-white text-2xl leading-none px-2 py-1 cursor-pointer"
      aria-label="Close"
    >
      ×
    </button>
  )
}
