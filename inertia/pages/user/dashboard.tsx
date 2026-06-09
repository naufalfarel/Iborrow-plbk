import { Head, Link, usePage } from '@inertiajs/react'
import UserLayout from '../../components/UserLayout'
import StatusBadge from '../../components/StatusBadge'
import clsx from 'clsx'
import type { Borrow, Notification, SharedProps } from '../../types'
import { format, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'

export default function Dashboard({ 
  stats, 
  categories,
  recommendations,
  activeBorrowsList,
  latestBorrows, 
  notifications 
}: { 
  stats: { active: number; pending: number; total: number; late: number; reputation: number }; 
  categories: { category: string; total: number }[];
  recommendations: any[];
  activeBorrowsList: Borrow[];
  latestBorrows: Borrow[]; 
  notifications: Notification[] 
}) {
  const { user } = usePage<SharedProps>().props

  // Helper categories icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mikrokontroler': return <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
      case 'Jaringan': return <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>;
      case 'Multimedia': return <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
      case 'Penyimpanan': return <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
      default: return <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
    }
  }

  return (
    <UserLayout>
      <Head title="Dashboard" />
      
      {/* Header Greeting */}
      <div className="mb-6">
        <p className="text-slate-500">Halo,</p>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          {user?.fullName} <span className="animate-wave text-3xl">👋</span>
        </h1>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-primary p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-4 border border-white/10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              Skor reputasi kamu: {stats.reputation}/100
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Butuh alat untuk tugas lab minggu ini?</h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              Cari, ajukan, dan ambil alat dengan mudah — semua dari satu tempat.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/items" className="px-5 py-2.5 rounded-xl bg-white text-primary font-bold text-sm shadow-md hover:bg-slate-50 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Ajukan Peminjaman
              </Link>
              <Link href="/items" className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2 backdrop-blur-md">
                Jelajah Katalog
              </Link>
            </div>
          </div>
          
          <div className="flex gap-4 self-stretch lg:self-auto w-full lg:w-auto">
            <div className="flex-1 lg:flex-none bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col justify-center min-w-[100px]">
              <div className="text-xs font-semibold text-indigo-100 mb-1">Aktif</div>
              <div className="text-3xl font-black">{stats.active}</div>
            </div>
            <div className="flex-1 lg:flex-none bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col justify-center min-w-[100px]">
              <div className="text-xs font-semibold text-indigo-100 mb-1">Menunggu</div>
              <div className="text-3xl font-black">{stats.pending}</div>
            </div>
            <div className="flex-1 lg:flex-none bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col justify-center min-w-[100px]">
              <div className="text-xs font-semibold text-indigo-100 mb-1">Selesai</div>
              <div className="text-3xl font-black">{stats.total - stats.active - stats.pending}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Cepat */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-900">Kategori Cepat</h2>
          <Link href="/items" className="text-sm font-semibold text-primary hover:text-indigo-700">Lihat semua &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/items?category=${cat.category}`} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-primary hover:shadow-md hover:shadow-primary/10 transition-all group">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                {getCategoryIcon(cat.category)}
              </div>
              <div className="font-semibold text-sm text-slate-800">{cat.category}</div>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-4 text-sm">Belum ada kategori.</div>
          )}
        </div>
      </div>

      {/* Two Column Layout for Peminjaman & Sidebar widgets */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3 items-start">
        
        {/* Left Column (2/3): Peminjaman Aktif */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-bold text-lg text-slate-900">Peminjaman Aktif</h2>
                <p className="text-sm text-slate-500 mt-1">Alat yang sedang kamu pinjam</p>
              </div>
              <Link href="/my-borrows" className="text-sm font-semibold text-primary hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">Kelola</Link>
            </div>

            <div className="space-y-4">
              {activeBorrowsList.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Kamu tidak memiliki peminjaman aktif saat ini.
                </div>
              ) : activeBorrowsList.map((borrow) => {
                const totalDays = differenceInDays(new Date(borrow.returnDate), new Date(borrow.borrowDate)) || 1
                const daysPassed = differenceInDays(new Date(), new Date(borrow.borrowDate))
                let progress = Math.round((daysPassed / totalDays) * 100)
                if (progress < 0) progress = 0
                if (progress > 100) progress = 100
                
                const daysLeft = differenceInDays(new Date(borrow.returnDate), new Date())
                
                let barColor = 'bg-primary'
                let textColor = 'text-primary'
                let warningText = `${daysLeft} hari lagi`
                
                if (daysLeft < 0) {
                  barColor = 'bg-red-500'
                  textColor = 'text-red-500'
                  warningText = `Terlambat ${Math.abs(daysLeft)} hari`
                  progress = 100
                } else if (daysLeft <= 2) {
                  barColor = 'bg-orange-500'
                  textColor = 'text-orange-500'
                }

                return (
                  <div key={borrow.id} className="border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:shadow-sm transition-all group relative overflow-hidden">
                    {/* Status badge floating top right */}
                    <div className="absolute top-5 right-5 text-xs font-bold text-slate-400 group-hover:hidden sm:block">
                      <StatusBadge value={borrow.status} />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        {getCategoryIcon(borrow.item?.category || '')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{borrow.item?.name}</h3>
                        <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{borrow.borrowCode} • Pinjam {format(new Date(borrow.borrowDate), 'dd MMM yyyy', { locale: id })}</p>
                      </div>
                      <div className="text-right flex flex-col justify-center sm:block mt-2 sm:mt-0">
                        <div className={clsx("font-bold", textColor)}>{warningText}</div>
                        <div className="text-xs text-slate-500 mt-1">Jatuh tempo {format(new Date(borrow.returnDate), 'dd MMM yyyy', { locale: id })}</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div className={clsx("h-full rounded-full transition-all duration-1000", barColor)} style={{ width: `${progress}%` }} />
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Link href={`/my-borrows/${borrow.id}`} className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors">Perpanjang</Link>
                      <Link href={`/my-borrows/${borrow.id}`} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm">Kembalikan</Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Pengingat & Profil Singkat */}
        <div className="space-y-6">
          {/* Pengingat (Notifs) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Pengingat
            </h2>
            <div className="space-y-3">
              {notifications.length === 0 && <p className="text-sm text-slate-500 text-center py-4">Belum ada pengingat.</p>}
              {notifications.map((notif) => {
                let bgColor = 'bg-slate-50 border-slate-100'
                let iconColor = 'text-slate-400'
                let icon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

                if (notif.type === 'reminder') {
                  bgColor = 'bg-orange-50 border-orange-100'
                  iconColor = 'text-orange-500'
                  icon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                } else if (notif.type === 'approved') {
                  bgColor = 'bg-emerald-50 border-emerald-100'
                  iconColor = 'text-emerald-500'
                  icon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                } else if (notif.type === 'rejected') {
                  bgColor = 'bg-red-50 border-red-100'
                  iconColor = 'text-red-500'
                  icon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                }

                return (
                  <div key={notif.id} className={clsx("rounded-xl p-4 border flex gap-3", bgColor)}>
                    <div className={clsx("mt-0.5", iconColor)}>{icon}</div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm leading-tight mb-1">{notif.title}</div>
                      <div className="text-xs text-slate-500">{format(new Date(notif.createdAt), 'dd MMM yyyy • HH:mm', { locale: id })}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Profil Singkat */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
            <h2 className="font-bold text-lg text-slate-900 mb-6">Profil Singkat</h2>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md shadow-primary/20">
                {user?.fullName?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-900 leading-tight">{user?.fullName}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{user?.nimNip || 'Mahasiswa'} • Informatika</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xl font-black text-slate-800">{stats.total}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Total Pinjam</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-3 text-indigo-700">
                <div className="text-xl font-black">{stats.reputation}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold mt-1 opacity-70">Skor</div>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-red-600">
                <div className="text-xl font-black">{stats.late}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold mt-1 opacity-70">Telat</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rekomendasi Alat */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Rekomendasi untuk kamu</h2>
            <p className="text-sm text-slate-500 mt-1">Berdasarkan ketersediaan inventaris terbaru</p>
          </div>
          <Link href="/items" className="text-sm font-semibold text-primary hover:text-indigo-700">Jelajahi katalog</Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col">
              <div className="h-40 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-4 text-slate-300 relative overflow-hidden group">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  getCategoryIcon(item.category)
                )}
              </div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.category}</div>
                  <div className="font-bold text-slate-900 mt-1 leading-tight line-clamp-2">{item.name}</div>
                </div>
                <div className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase shrink-0">Tersedia</div>
              </div>
              
              <div className="mt-auto pt-4">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
                  <span>Stok</span>
                  <span>{item.stockAvailable} / {item.stockTotal}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(item.stockAvailable / item.stockTotal) * 100}%` }} />
                </div>
                <Link href={`/items/${item.id}`} className="block w-full py-2.5 bg-slate-900 text-white text-center rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm">
                  Pinjam Sekarang
                </Link>
              </div>
            </div>
          ))}
          {recommendations.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-3xl">Belum ada alat yang tersedia.</div>
          )}
        </div>
      </div>

      {/* Riwayat Peminjaman */}
      <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Riwayat Peminjaman</h2>
            <p className="text-sm text-slate-500 mt-1">Aktivitas peminjaman terdahulu</p>
          </div>
          <Link href="/history" className="text-sm font-semibold text-primary hover:text-indigo-700">Semua riwayat</Link>
        </div>
        
        <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="py-3 font-semibold w-1/2">Alat</th>
                <th className="py-3 font-semibold">Tanggal</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {latestBorrows.map((borrow) => (
                <tr key={borrow.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4">
                    <div className="font-bold text-slate-900">{borrow.item?.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{borrow.borrowCode}</div>
                  </td>
                  <td className="py-4 text-slate-600">
                    {format(new Date(borrow.borrowDate), 'dd MMM yyyy', { locale: id })}
                  </td>
                  <td className="py-4">
                    <StatusBadge value={borrow.status} />
                  </td>
                  <td className="py-4 text-right">
                    <Link href={`/history/${borrow.id}`} className="font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Detail</Link>
                  </td>
                </tr>
              ))}
              {latestBorrows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">Belum ada riwayat peminjaman.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </UserLayout>
  )
}
