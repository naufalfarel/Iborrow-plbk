import { Head, Link } from '@inertiajs/react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AdminLayout from '../../components/AdminLayout'
import StatusBadge from '../../components/StatusBadge'
import clsx from 'clsx'
import type { Borrow } from '../../types'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface WeeklyRow { day: string; borrow_count: number; return_count: number }
interface CategoryRow { category: string; total: number }

export default function AdminDashboard({ 
  stats, 
  weekly, 
  categories, 
  topItems,
  latestBorrows,
  activities
}: { 
  stats: { totalItems: number; pending: number; activeUsers: number; returnRate: number; late: number; todayRequests: number }; 
  weekly: WeeklyRow[]; 
  categories: CategoryRow[]; 
  topItems: any[];
  latestBorrows: Borrow[];
  activities: any[];
}) {
  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />
      
      {/* Header Greeting */}
      <div className="mb-6">
        <p className="text-slate-500">Selamat datang kembali,</p>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          Admin Panel <span className="animate-wave text-3xl">👋</span>
        </h1>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden flex flex-col lg:flex-row gap-8 items-center justify-between">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-3xl mix-blend-screen pointer-events-none -mr-32 -mt-32" />
        
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold mb-4 border border-white/10">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Ringkasan harian
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Lab Informatika berjalan lancar hari ini.</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
            <strong className="text-white">{stats.todayRequests} permintaan baru</strong> menunggu persetujuan, <strong className="text-white">{stats.late} alat terlambat</strong> dikembalikan — perlu tindak lanjut.
          </p>
          <div className="flex gap-3">
            <Link href="/admin/borrows" className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-md hover:bg-slate-100 transition-colors">
              Tinjau Permintaan
            </Link>
            <Link href="/admin/reports" className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm border border-white/20 hover:bg-white/20 transition-colors">
              Buat Laporan
            </Link>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto self-stretch lg:self-auto">
          <Link href="/admin/borrows" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors group">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
            <div>
              <div className="font-bold text-sm text-white">Approve Permintaan</div>
              <div className="text-xs text-slate-400 mt-0.5">{stats.pending} baru</div>
            </div>
          </Link>
          <Link href="/admin/items" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors group">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
            <div>
              <div className="font-bold text-sm text-white">Tambah Inventaris</div>
              <div className="text-xs text-slate-400 mt-0.5">{stats.totalItems} alat</div>
            </div>
          </Link>
          <Link href="/admin/users" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors group">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
            <div>
              <div className="font-bold text-sm text-white">Kelola Pengguna</div>
              <div className="text-xs text-slate-400 mt-0.5">{stats.activeUsers} user</div>
            </div>
          </Link>
          <Link href="/admin/reports" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors group">
            <div className="h-10 w-10 rounded-lg bg-orange-500/20 text-orange-300 flex items-center justify-center group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
            <div>
              <div className="font-bold text-sm text-white">Ekspor Laporan</div>
              <div className="text-xs text-slate-400 mt-0.5">Bulan ini</div>
            </div>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alat', value: stats.totalItems, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, color: 'text-indigo-500', bg: 'bg-indigo-50', trend: '+12' },
          { label: 'Menunggu Approval', value: stats.pending, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, color: 'text-blue-500', bg: 'bg-blue-50', trend: `+${stats.todayRequests}` },
          { label: 'Pengguna Aktif', value: stats.activeUsers, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+126' },
          { label: 'Terlambat Kembali', value: stats.late, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-orange-500', bg: 'bg-orange-50', trend: `-${stats.late}` },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-6 right-6 px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">
              {stat.trend.startsWith('-') ? <span className="text-red-600">↘ {stat.trend}</span> : <span>↗ {stat.trend}</span>}
            </div>
            <div className={clsx("h-10 w-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:col-span-2">
          <h2 className="font-bold text-lg text-slate-900 mb-1">Tren Peminjaman</h2>
          <p className="text-sm text-slate-500 mb-6">7 hari terakhir</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBorrow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', padding: '12px 16px' }}
                  itemStyle={{ fontWeight: 600, fontSize: '14px' }}
                  labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="borrow_count" name="Dipinjam" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBorrow)" />
                <Area type="monotone" dataKey="return_count" name="Dikembalikan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReturn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-3xl p-6">
          <h2 className="font-bold text-lg text-slate-900 mb-1">Kategori Terpopuler</h2>
          <p className="text-sm text-slate-500 mb-6">Distribusi inventaris aktif</p>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categories} 
                  dataKey="total" 
                  nameKey="category" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  stroke="none"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categories.slice(0, 4).map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="font-semibold text-slate-700">{cat.category}</span>
                </div>
                <span className="font-bold text-slate-900">{cat.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Terbaru, Paling Dipinjam, Aktivitas */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        
        {/* Peminjaman Terbaru */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:col-span-2 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Peminjaman Terbaru</h2>
              <p className="text-sm text-slate-500 mt-1">Permintaan masuk dalam minggu ini</p>
            </div>
            <Link href="/admin/borrows" className="text-sm font-semibold text-primary hover:text-indigo-700">Lihat semua</Link>
          </div>
          
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-3 font-semibold">Peminjam</th>
                  <th className="py-3 font-semibold">Alat</th>
                  <th className="py-3 font-semibold">Jatuh Tempo</th>
                  <th className="py-3 font-semibold text-center">Status</th>
                  <th className="py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {latestBorrows.map((borrow) => (
                  <tr key={borrow.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {borrow.user?.fullName?.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{borrow.user?.fullName}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">{borrow.user?.nimNip}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-slate-700">{borrow.item?.name}</td>
                    <td className="py-4 text-slate-500">{format(new Date(borrow.returnDate), 'dd MMM yyyy', { locale: id })}</td>
                    <td className="py-4 text-center">
                      <StatusBadge value={borrow.status} />
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/admin/borrows/${borrow.id}`} className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-200 transition-colors">Review</Link>
                    </td>
                  </tr>
                ))}
                {latestBorrows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">Belum ada peminjaman terbaru.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side wrapper */}
        <div className="space-y-8">
          
          {/* Alat Paling Dipinjam */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <h2 className="font-bold text-lg text-slate-900 mb-1">Alat Paling Dipinjam</h2>
            <p className="text-sm text-slate-500 mb-6">Bulan ini</p>
            
            <div className="space-y-4">
              {topItems.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-slate-400 font-bold text-xs">{idx + 1}</span> {item.name}
                    </div>
                    <div className="font-black text-slate-900">{item.borrow_count}</div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, item.borrow_count * 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aktivitas Terkini */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-slate-900">Aktivitas Terkini</h2>
              <span className="text-xs font-semibold text-primary">Log sistem</span>
            </div>
            
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {activities.map((act) => {
                let color = 'bg-slate-100 text-slate-500 border-slate-200'
                if (act.type === 'approved' || act.type === 'returned') color = 'bg-emerald-100 text-emerald-600 border-emerald-200'
                if (act.type === 'rejected' || act.type === 'reminder') color = 'bg-red-100 text-red-600 border-red-200'

                return (
                  <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={clsx("flex items-center justify-center w-4 h-4 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10", color)} />
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-semibold text-slate-800 text-xs leading-tight mb-1">{act.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{format(new Date(act.time), 'dd MMM yyyy HH:mm', { locale: id })}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
      
    </AdminLayout>
  )
}
