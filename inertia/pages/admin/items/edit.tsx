import { Head, useForm } from '@inertiajs/react'
import AdminLayout from '../../../components/AdminLayout'
import type { Item } from '../../../types'

const categories = ['Laptop', 'Proyektor', 'Kamera', 'Audio', 'Kabel', 'Jaringan', 'Mikrokontroler', 'Furnitur', 'Aksesoris']
const conditions = ['baik', 'rusak_ringan', 'rusak_berat']

export default function EditItem({ item }: { item: Item }) {
  const form = useForm({
    _method: 'PUT',
    code: item.code,
    name: item.name,
    category: item.category,
    description: item.description ?? '',
    stock_total: item.stockTotal,
    stock_available: item.stockAvailable,
    condition: item.condition,
    image_url: item.imageUrl ?? '',
    is_active: item.isActive
  })

  return (
    <AdminLayout title="Edit Alat">
      <Head title="Edit Alat" />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.post(`/admin/items/${item.id}`)
        }}
        className="card grid gap-4 p-6 md:grid-cols-2"
      >
        <div><label className="label">Kode Item</label><input className="input" value={form.data.code} onChange={(e) => form.setData('code', e.target.value)} /></div>
        <div><label className="label">Nama Item</label><input className="input" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} /></div>
        <div><label className="label">Kategori</label><select className="input" value={form.data.category} onChange={(e) => form.setData('category', e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label">Kondisi</label><select className="input" value={form.data.condition} onChange={(e) => form.setData('condition', e.target.value)}>{conditions.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label">Stok Total</label><input className="input" type="number" min={1} value={form.data.stock_total} onChange={(e) => form.setData('stock_total', Number(e.target.value))} /></div>
        <div><label className="label">Stok Tersedia</label><input className="input" type="number" min={0} value={form.data.stock_available} onChange={(e) => form.setData('stock_available', Number(e.target.value))} /></div>
        <div><label className="label">URL Gambar</label><input className="input" value={form.data.image_url} onChange={(e) => form.setData('image_url', e.target.value)} /></div>
        <label className="flex items-end gap-2 pb-3 text-sm font-semibold">
          <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
          Aktif
        </label>
        <div className="md:col-span-2"><label className="label">Deskripsi</label><textarea className="input min-h-28" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} /></div>
        <div className="md:col-span-2">
          {form.hasErrors && (
            <div className="mb-3 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {Object.values(form.errors).join(', ')}
            </div>
          )}
          <button className="btn-primary" disabled={form.processing}>
            {form.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
