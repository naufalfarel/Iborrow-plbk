import { Head, Link, useForm } from '@inertiajs/react'
import UserLayout from '../../components/UserLayout'
import StatusBadge from '../../components/StatusBadge'
import type { Borrow } from '../../types'
import { format, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'

function plusSeven(dateValue: string) {
  const date = new Date(dateValue)
  date.setDate(date.getDate() + 7)
  return date.toISOString().slice(0, 10)
}

export default function BorrowDetail({ borrow }: { borrow: Borrow }) {
  const extendForm = useForm({ return_date: plusSeven(borrow.returnDate) })
  const returnForm = useForm({})

  const daysLeft = differenceInDays(new Date(borrow.returnDate), new Date())
  const canExtend = ['disetujui', 'dipinjam'].includes(borrow.status)
  const canReturn = ['disetujui', 'dipinjam', 'terlambat'].includes(borrow.status)

  return (
    <UserLayout>
      <Head title="Detail Peminjaman" />
      <div className="mb-6">
        <Link href="/my-borrows" className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali ke Peminjaman Aktif
        </Link>
        <h1 className="text-3xl font-black text-slate-900">Detail Peminjaman</h1>
        <p className="text-slate-500 mt-1">{borrow.borrowCode}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{borrow.item?.name}</h2>
                <p className="text-slate-500 text-sm mt-1">{borrow.item?.category} · {borrow.item?.code}</p>
              </div>
              <StatusBadge value={borrow.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Pinjam</div>
                <div className="font-semibold text-slate-800">
                  {format(new Date(borrow.borrowDate), 'dd MMMM yyyy', { locale: id })}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jatuh Tempo</div>
                <div className={`font-semibold ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 2 ? 'text-orange-600' : 'text-slate-800'}`}>
                  {format(new Date(borrow.returnDate), 'dd MMMM yyyy', { locale: id })}
                  <span className="ml-2 text-xs">
                    {daysLeft < 0 ? `(terlambat ${Math.abs(daysLeft)} hari)` : daysLeft === 0 ? '(hari ini)' : `(${daysLeft} hari lagi)`}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jumlah</div>
                <div className="font-semibold text-slate-800">{borrow.quantity} unit</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tujuan</div>
                <div className="font-semibold text-slate-800">{borrow.purpose}</div>
              </div>
            </div>

            {borrow.notes && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Catatan Admin</div>
                <p className="text-sm text-slate-700">{borrow.notes}</p>
              </div>
            )}
          </div>

          {/* Extend form */}
          {canExtend && (
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4">Perpanjang Peminjaman</h3>
              <form onSubmit={(e) => { e.preventDefault(); extendForm.post(`/borrow/${borrow.id}/extend`) }}>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="label">Tanggal Baru Pengembalian</label>
                    <input
                      className="input"
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={extendForm.data.return_date}
                      onChange={(e) => extendForm.setData('return_date', e.target.value)}
                    />
                  </div>
                  <button className="btn-primary" disabled={extendForm.processing}>
                    Perpanjang +7 hari
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Actions sidebar */}
        <div className="space-y-4">
          {canReturn && (
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-2">Kembalikan Alat</h3>
              <p className="text-sm text-slate-500 mb-4">
                Konfirmasikan ke staf lab untuk proses pengembalian fisik alat.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); returnForm.post(`/my-borrows/${borrow.id}/return-request`) }}>
                <button className="btn-primary w-full justify-center" disabled={returnForm.processing}>
                  Ajukan Pengembalian
                </button>
              </form>
            </div>
          )}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4">Informasi Alat</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Kode</span>
                <span className="font-semibold">{borrow.item?.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori</span>
                <span className="font-semibold">{borrow.item?.category}</span>
              </div>
            </div>
          </div>
          <Link href="/my-borrows" className="btn-secondary w-full justify-center flex">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    </UserLayout>
  )
}
