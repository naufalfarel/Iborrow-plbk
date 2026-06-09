import { Head, useForm } from '@inertiajs/react'
import UserLayout from '../../components/UserLayout'
import StatusBadge from '../../components/StatusBadge'
import type { Borrow, Paginated } from '../../types'

function plusSeven(dateValue: string) {
  const date = new Date(dateValue)
  date.setDate(date.getDate() + 7)
  return date.toISOString().slice(0, 10)
}

function ExtendButton({ borrow }: { borrow: Borrow }) {
  const form = useForm({ return_date: plusSeven(borrow.returnDate) })
  if (!['disetujui', 'dipinjam'].includes(borrow.status)) return null
  return <button className="text-sm font-semibold text-primary" onClick={() => form.post(`/borrow/${borrow.id}/extend`)}>Perpanjang +7 hari</button>
}

export default function MyBorrows({ borrows }: { borrows: Paginated<Borrow> }) {
  return (
    <UserLayout>
      <Head title="Peminjaman Aktif" />
      <h1 className="mb-6 text-3xl font-black">Peminjaman Aktif</h1>
      <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left"><tr><th className="p-4">Kode</th><th>Alat</th><th>Tgl Pinjam</th><th>Tgl Kembali</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{borrows.data.map((borrow) => <tr key={borrow.id} className="border-t border-slate-100"><td className="p-4 font-semibold">{borrow.borrowCode}</td><td>{borrow.item?.name}</td><td>{borrow.borrowDate}</td><td>{borrow.returnDate}</td><td><StatusBadge value={borrow.status} /></td><td><ExtendButton borrow={borrow} /></td></tr>)}</tbody></table></div>
    </UserLayout>
  )
}
