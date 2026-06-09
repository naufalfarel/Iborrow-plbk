import { Head, useForm } from '@inertiajs/react'
import AdminLayout from '../../../components/AdminLayout'

const categories = ['Laptop', 'Proyektor', 'Kamera', 'Audio', 'Kabel', 'Jaringan', 'Mikrokontroler', 'Furnitur', 'Aksesoris']
const conditions = ['baik', 'rusak_ringan', 'rusak_berat']

export default function CreateItem() {
  const form = useForm({ code: '', name: '', category: 'Laptop', description: '', stock_total: 1, stock_available: 1, condition: 'baik', image_url: '' })
  return (
    <AdminLayout title="Tambah Alat Baru"><Head title="Tambah Alat" />
      <form onSubmit={(e) => { e.preventDefault(); form.post('/admin/items') }} className="card grid gap-4 p-6 md:grid-cols-2">
        <div><label className="label">Kode Item</label><input className="input" value={form.data.code} onChange={(e) => form.setData('code', e.target.value)} placeholder="I-011" /></div>
        <div><label className="label">Nama Item</label><input className="input" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} /></div>
        <div><label className="label">Kategori</label><select className="input" value={form.data.category} onChange={(e) => form.setData('category', e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label">Kondisi</label><select className="input" value={form.data.condition} onChange={(e) => form.setData('condition', e.target.value)}>{conditions.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label">Stok Total</label><input className="input" type="number" min={1} value={form.data.stock_total} onChange={(e) => { const val = Number(e.target.value); form.setData('stock_total', val); form.setData('stock_available', val) }} /></div>
        <div><label className="label">URL Gambar</label><input className="input" value={form.data.image_url} onChange={(e) => form.setData('image_url', e.target.value)} /></div>
        <div className="md:col-span-2"><label className="label">Deskripsi</label><textarea className="input min-h-28" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} /></div>
        <div className="md:col-span-2"><button className="btn-primary" disabled={form.processing}>Simpan Alat</button></div>
      </form>
    </AdminLayout>
  )
}
