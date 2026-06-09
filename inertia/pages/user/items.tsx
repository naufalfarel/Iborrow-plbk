import { Head, Link, router } from '@inertiajs/react'
import UserLayout from '../../components/UserLayout'
import StatusBadge from '../../components/StatusBadge'
import type { Item, Paginated } from '../../types'

const categories = ['Semua', 'Laptop', 'Proyektor', 'Kamera', 'Audio', 'Kabel', 'Jaringan', 'Mikrokontroler', 'Furnitur', 'Aksesoris']

export default function Items({ items, filters }: { items: Paginated<Item>; filters: { search: string; category: string } }) {
  const updateFilter = (key: 'search' | 'category', value: string) => router.get('/items', { ...filters, [key]: value }, { preserveState: true })
  return (
    <UserLayout>
      <Head title="Daftar Alat" />
      <div className="mb-6"><h1 className="text-3xl font-black">Daftar Alat</h1><p className="mt-2 text-slate-600">Cari alat lab dan ajukan peminjaman sesuai kebutuhan.</p></div>
      <div className="mb-6 grid gap-3 md:grid-cols-3"><input className="input md:col-span-2" placeholder="Cari nama alat..." defaultValue={filters.search} onBlur={(e) => updateFilter('search', e.target.value)} /><select className="input" value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.data.map((item) => (
          <article key={item.id} className="card overflow-hidden">
            <div className="h-40 bg-slate-100"><img src={item.imageUrl ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475'} alt={item.name} className="h-full w-full object-cover" /></div>
            <div className="p-5"><div className="mb-2 flex items-start justify-between gap-3"><h2 className="text-lg font-bold">{item.name}</h2><StatusBadge value={item.stockAvailable > 0 ? 'tersedia' : 'habis'} /></div><p className="text-sm text-slate-500">{item.category} • {item.code}</p><p className="mt-3 text-sm text-slate-600">Stok tersedia: <b>{item.stockAvailable}</b> / {item.stockTotal}</p><div className="mt-3"><StatusBadge value={item.condition} /></div>{item.stockAvailable > 0 ? <Link href={`/borrow/${item.id}`} className="btn-primary mt-5 w-full">Pinjam</Link> : <button className="btn-primary mt-5 w-full" disabled>Stok Habis</button>}</div>
          </article>
        ))}
      </div>
    </UserLayout>
  )
}
