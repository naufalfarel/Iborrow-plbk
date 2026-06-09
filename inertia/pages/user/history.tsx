import { Head, router } from '@inertiajs/react'
import UserLayout from '../../components/UserLayout'
import StatusBadge from '../../components/StatusBadge'
import type { Borrow, BorrowStatus, Paginated } from '../../types'

const statuses = ['Semua', 'menunggu', 'disetujui', 'dipinjam', 'terlambat', 'dikembalikan', 'ditolak']

export default function History({ borrows, filters }: { borrows: Paginated<Borrow>; filters: { status: string } }) {
  return (
    <UserLayout>
      <Head title="Riwayat" />
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center"><h1 className="text-3xl font-black">Riwayat Peminjaman</h1><select className="input max-w-xs" value={filters.status} onChange={(e) => router.get('/history', { status: e.target.value })}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left"><tr><th className="p-4">Kode</th><th>Alat</th><th>Tgl Pinjam</th><th>Tgl Kembali</th><th>Status</th></tr></thead><tbody>{borrows.data.map((borrow) => <tr key={borrow.id} className="border-t border-slate-100"><td className="p-4 font-semibold">{borrow.borrowCode}</td><td>{borrow.item?.name}</td><td>{borrow.borrowDate}</td><td>{borrow.returnDate}</td><td><StatusBadge value={borrow.status as BorrowStatus} /></td></tr>)}</tbody></table></div>
    </UserLayout>
  )
}
