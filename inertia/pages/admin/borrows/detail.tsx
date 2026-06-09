import { Head, useForm } from '@inertiajs/react'
import AdminLayout from '../../../components/AdminLayout'
import StatusBadge from '../../../components/StatusBadge'
import type { Borrow } from '../../../types'

export default function BorrowDetail({ borrow }: { borrow: Borrow }) {
  const review = useForm({ notes: '' })
  const returned = useForm({ item_condition_on_return: 'baik', notes: '' })
  return (
    <AdminLayout title={`Detail ${borrow.borrowCode}`}><Head title="Detail Peminjaman" />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-2"><div className="flex items-start justify-between"><div><h2 className="text-xl font-black">{borrow.item?.name}</h2><p className="mt-1 text-slate-500">{borrow.item?.code} • {borrow.item?.category}</p></div><StatusBadge value={borrow.status} /></div><div className="mt-6 grid gap-4 md:grid-cols-2"><Info label="Peminjam" value={borrow.user?.fullName ?? '-'} /><Info label="Role" value={borrow.user?.role ?? '-'} /><Info label="NIM/NIP" value={borrow.user?.nimNip ?? '-'} /><Info label="Jumlah" value={String(borrow.quantity)} /><Info label="Tanggal Pinjam" value={borrow.borrowDate} /><Info label="Rencana Kembali" value={borrow.returnDate} /></div><div className="mt-6"><h3 className="font-bold">Tujuan</h3><p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{borrow.purpose}</p></div>{borrow.notes && <div className="mt-4"><h3 className="font-bold">Catatan</h3><p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{borrow.notes}</p></div>}</section>
        <aside className="card p-6"><h2 className="text-lg font-bold">Aksi Staf/Admin</h2>{borrow.status === 'menunggu' && <div className="mt-4 space-y-3"><textarea className="input min-h-28" placeholder="Catatan approve/reject" value={review.data.notes} onChange={(e) => review.setData('notes', e.target.value)} /><button className="btn-primary w-full" onClick={() => review.post(`/admin/borrows/${borrow.id}/approve`)}>Setujui</button><button className="btn-danger w-full" onClick={() => review.post(`/admin/borrows/${borrow.id}/reject`)}>Tolak</button></div>}{['disetujui', 'dipinjam', 'terlambat'].includes(borrow.status) && <div className="mt-4 space-y-3"><select className="input" value={returned.data.item_condition_on_return} onChange={(e) => returned.setData('item_condition_on_return', e.target.value)}><option value="baik">Baik</option><option value="rusak_ringan">Rusak Ringan</option><option value="rusak_berat">Rusak Berat</option></select><textarea className="input min-h-24" placeholder="Catatan pengembalian" value={returned.data.notes} onChange={(e) => returned.setData('notes', e.target.value)} /><button className="btn-primary w-full" onClick={() => returned.post(`/admin/borrows/${borrow.id}/return`)}>Konfirmasi Pengembalian</button></div>}{!['menunggu', 'disetujui', 'dipinjam', 'terlambat'].includes(borrow.status) && <p className="mt-4 text-sm text-slate-500">Tidak ada aksi untuk status ini.</p>}</aside>
      </div>
    </AdminLayout>
  )
}

function Info({ label, value }: { label: string; value: string }) { return <div><div className="text-sm font-semibold text-slate-500">{label}</div><div className="mt-1 font-bold text-slate-900 capitalize">{value}</div></div> }
