import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '../../../components/AdminLayout'
import StatusBadge from '../../../components/StatusBadge'
import type { Borrow, Paginated } from '../../../types'

const statuses = ['Semua', 'menunggu', 'disetujui', 'dipinjam', 'terlambat', 'dikembalikan', 'ditolak']

export default function BorrowsIndex({ borrows, filters }: { borrows: Paginated<Borrow>; filters: { status: string } }) {
  return (
    <AdminLayout title="Manajemen Peminjaman"><Head title="Peminjaman" />
      <div className="mb-5 flex flex-wrap gap-2">{statuses.map((status) => <button key={status} onClick={() => router.get('/admin/borrows', { status })} className={filters.status === status ? 'btn-primary' : 'btn-secondary'}>{status}</button>)}</div>
      <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left"><tr><th className="p-4">Kode</th><th>Peminjam</th><th>Role</th><th>Alat</th><th>Tgl Pinjam</th><th>Tgl Kembali</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{borrows.data.map((borrow) => <tr key={borrow.id} className="border-t border-slate-100"><td className="p-4 font-semibold">{borrow.borrowCode}</td><td>{borrow.user?.fullName}</td><td className="capitalize">{borrow.user?.role}</td><td>{borrow.item?.name}</td><td>{borrow.borrowDate}</td><td>{borrow.returnDate}</td><td><StatusBadge value={borrow.status} /></td><td><Link href={`/admin/borrows/${borrow.id}`} className="font-semibold text-primary">Detail</Link></td></tr>)}</tbody></table></div>
    </AdminLayout>
  )
}
