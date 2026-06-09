import { usePage } from '@inertiajs/react'
import type { SharedProps } from '../types'

export default function FlashMessage() {
  const { flash } = usePage<SharedProps>().props

  if (!flash?.success && !flash?.error) return null

  return (
    <div className="mb-5 space-y-2">
      {flash.success && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">{flash.success}</div>}
      {flash.error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{flash.error}</div>}
    </div>
  )
}
