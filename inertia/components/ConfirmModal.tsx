export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Ya, lanjutkan',
  onConfirm,
  onCancel
}: {
  open: boolean
  title: string
  message: string
  confirmText?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>Batal</button>
          <button className="btn-danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
