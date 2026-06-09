import clsx from 'clsx'
import { Link, usePage } from '@inertiajs/react'
import type { SharedProps } from '../types'

const menu = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/items', label: 'Inventaris' },
  { href: '/admin/borrows', label: 'Peminjaman' },
  { href: '/admin/users', label: 'Pengguna' },
  { href: '/admin/reports', label: 'Laporan' }
]

export default function Sidebar() {
  const { url, props } = usePage<SharedProps>()

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-6 lg:block">
      <Link href="/admin" className="mb-8 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white font-bold">IB</span>
        <div>
          <div className="text-lg font-bold text-slate-900">IBorrow</div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Campus Lab</div>
        </div>
      </Link>
      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'block rounded-xl px-4 py-3 text-sm font-semibold transition',
              url === item.href || (item.href !== '/admin' && url.startsWith(item.href))
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-50 p-4 text-sm">
        <div className="font-semibold text-slate-900">{props.user?.fullName}</div>
        <div className="capitalize text-slate-500">{props.user?.role}</div>
        <Link href="/logout" method="post" as="button" className="mt-3 text-sm font-semibold text-red-600">Logout</Link>
      </div>
    </aside>
  )
}
