import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import ConfirmModal from '../../../components/ConfirmModal'
import StatusBadge from '../../../components/StatusBadge'
import type { Item, Paginated } from '../../../types'

export default function ItemsIndex({ items, filters }: { items: Paginated<Item>; filters: { search: string } }) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  return (
    <AdminLayout title="Manajemen Inventaris">
      <Head title="Inventaris" />
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center"><input className="input max-w-md" defaultValue={filters.search} placeholder="Cari kode atau nama..." onBlur={(e) => router.get('/admin/items', { search: e.target.value }, { preserveState: true })} /><Link href="/admin/items/create" className="btn-primary">Tambah Alat Baru</Link></div>
      <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left"><tr><th className="p-4">Kode</th><th>Nama</th><th>Kategori</th><th>Total</th><th>Tersedia</th><th>Kondisi</th><th>Aksi</th></tr></thead><tbody>{items.data.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="p-4 font-semibold">{item.code}</td><td>{item.name}</td><td>{item.category}</td><td>{item.stockTotal}</td><td>{item.stockAvailable}</td><td><StatusBadge value={item.condition} /></td><td className="space-x-3"><Link href={`/admin/items/${item.id}/edit`} className="font-semibold text-primary">Edit</Link><button onClick={() => setDeleteId(item.id)} className="font-semibold text-red-600">Hapus</button></td></tr>)}</tbody></table></div>
      <ConfirmModal open={deleteId !== null} title="Nonaktifkan alat?" message="Data tidak dihapus permanen, hanya disembunyikan dari daftar peminjaman." onCancel={() => setDeleteId(null)} onConfirm={() => { if (deleteId) router.delete(`/admin/items/${deleteId}`); setDeleteId(null) }} />
    </AdminLayout>
  )
}
