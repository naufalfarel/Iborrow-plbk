import { Head, useForm } from '@inertiajs/react'
import UserLayout from '../../components/UserLayout'
import StatusBadge from '../../components/StatusBadge'
import type { Item } from '../../types'

const today = new Date().toISOString().slice(0, 10)
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

export default function BorrowForm({ item }: { item: Item }) {
  const form = useForm({ item_id: item.id, quantity: 1, borrow_date: today, return_date: tomorrow, purpose: '' })
  return (
    <UserLayout>
      <Head title="Form Pinjam" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card overflow-hidden"><img src={item.imageUrl ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475'} className="h-56 w-full object-cover" /><div className="p-5"><h1 className="text-2xl font-black">{item.name}</h1><p className="mt-2 text-slate-500">{item.code} • {item.category}</p><p className="mt-3 text-sm text-slate-600">Stok tersedia: <b>{item.stockAvailable}</b></p><div className="mt-3"><StatusBadge value={item.condition} /></div></div></div>
        <form onSubmit={(e) => { e.preventDefault(); form.post('/borrow') }} className="card p-6 lg:col-span-2">
          <h2 className="text-xl font-bold">Ajukan Peminjaman</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2"><div><label className="label">Jumlah</label><input className="input" type="number" min={1} max={item.stockAvailable} value={form.data.quantity} onChange={(e) => form.setData('quantity', Number(e.target.value))} /></div><div><label className="label">Tanggal Pinjam</label><input className="input" type="date" min={today} value={form.data.borrow_date} onChange={(e) => form.setData('borrow_date', e.target.value)} /></div><div><label className="label">Tanggal Rencana Kembali</label><input className="input" type="date" min={tomorrow} value={form.data.return_date} onChange={(e) => form.setData('return_date', e.target.value)} /></div></div>
          <div className="mt-4"><label className="label">Tujuan Peminjaman</label><textarea className="input min-h-32" value={form.data.purpose} onChange={(e) => form.setData('purpose', e.target.value)} placeholder="Jelaskan tujuan peminjaman minimal 10 karakter." /></div>
          <button className="btn-primary mt-5" disabled={form.processing}>Submit Pengajuan</button>
        </form>
      </div>
    </UserLayout>
  )
}
