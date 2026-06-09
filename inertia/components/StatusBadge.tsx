import clsx from 'clsx'
import type { BorrowStatus, ItemCondition, UserRole } from '../types'

type BadgeValue = BorrowStatus | ItemCondition | UserRole | 'tersedia' | 'habis' | 'aktif' | 'nonaktif'

const classMap: Record<BadgeValue, string> = {
  menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  disetujui: 'bg-green-100 text-green-800 border-green-200',
  ditolak: 'bg-red-100 text-red-800 border-red-200',
  dipinjam: 'bg-blue-100 text-blue-800 border-blue-200',
  dikembalikan: 'bg-slate-100 text-slate-700 border-slate-200',
  terlambat: 'bg-orange-100 text-orange-800 border-orange-200',
  baik: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rusak_ringan: 'bg-amber-100 text-amber-800 border-amber-200',
  rusak_berat: 'bg-rose-100 text-rose-800 border-rose-200',
  mahasiswa: 'bg-sky-100 text-sky-800 border-sky-200',
  dosen: 'bg-purple-100 text-purple-800 border-purple-200',
  staf: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  admin: 'bg-slate-900 text-white border-slate-900',
  tersedia: 'bg-green-100 text-green-800 border-green-200',
  habis: 'bg-slate-100 text-slate-500 border-slate-200',
  aktif: 'bg-green-100 text-green-800 border-green-200',
  nonaktif: 'bg-red-100 text-red-800 border-red-200'
}

export default function StatusBadge({ value }: { value: BadgeValue }) {
  return (
    <span className={clsx('inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize', classMap[value])}>
      {value.replace('_', ' ')}
    </span>
  )
}
