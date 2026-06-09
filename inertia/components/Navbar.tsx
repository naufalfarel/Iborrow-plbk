import { Link, usePage } from '@inertiajs/react'
import type { SharedProps } from '../types'

export default function Navbar() {
  const { user } = usePage<SharedProps>().props

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-primary">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">IB</span>
          <span>IBorrow</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/items" className="hover:text-primary">Alat</Link>
          <Link href="/my-borrows" className="hover:text-primary">Peminjaman</Link>
          <Link href="/history" className="hover:text-primary">Riwayat</Link>
          <Link href="/notifications" className="hover:text-primary">Notifikasi</Link>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-sm sm:block">
            <div className="font-semibold text-slate-900">{user?.fullName}</div>
            <div className="capitalize text-slate-500">{user?.role}</div>
          </div>
          <Link href="/logout" method="post" as="button" className="btn-secondary">Logout</Link>
        </div>
      </div>
    </header>
  )
}
