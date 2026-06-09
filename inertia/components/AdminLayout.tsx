import clsx from 'clsx'
import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import type { SharedProps } from '../types'
import FlashMessage from './FlashMessage'

const adminMenu = [
  { href: '/admin', label: 'Dashboard', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { href: '/admin/items', label: 'Inventaris', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { href: '/admin/borrows', label: 'Peminjaman', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
  { href: '/admin/users', label: 'Pengguna', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  { href: '/admin/reports', label: 'Laporan', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { url, props } = usePage<SharedProps>()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-100 bg-white lg:flex flex-col">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white shadow-md shadow-accent/30">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div>
              <div className="font-black text-xl text-slate-800 tracking-tight">iBorrow</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block -mt-1">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {adminMenu.map((item) => {
            const isActive = url === item.href || (item.href !== '/admin' && url.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <div className="px-4 py-3 mb-2 rounded-xl bg-slate-50 flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
               {props.user?.fullName?.slice(0,2)}
             </div>
             <div>
               <div className="text-sm font-bold text-slate-800">{props.user?.fullName}</div>
               <div className="text-xs text-slate-500 capitalize">{props.user?.role}</div>
             </div>
          </div>
          <Link href="/logout" method="post" as="button" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 w-full transition-all">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Keluar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        <div className="p-4 sm:p-8 flex-1">
          <FlashMessage />
          {children}
        </div>
      </main>
    </div>
  )
}
