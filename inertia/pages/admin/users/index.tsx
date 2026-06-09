import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '../../../components/AdminLayout'
import StatusBadge from '../../../components/StatusBadge'
import type { Paginated, SharedUser } from '../../../types'

interface UserRow extends SharedUser { isActive: boolean }
const roles = ['Semua', 'mahasiswa', 'dosen', 'staf', 'admin']

export default function UsersIndex({ users, filters }: { users: Paginated<UserRow>; filters: { search: string; role: string } }) {
  return (
    <AdminLayout title="Manajemen Pengguna"><Head title="Pengguna" />
      <div className="mb-5 grid gap-3 md:grid-cols-3"><input className="input md:col-span-2" placeholder="Cari nama/email..." defaultValue={filters.search} onBlur={(e) => router.get('/admin/users', { ...filters, search: e.target.value })} /><select className="input" value={filters.role} onChange={(e) => router.get('/admin/users', { ...filters, role: e.target.value })}>{roles.map((role) => <option key={role}>{role}</option>)}</select></div>
      <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left"><tr><th className="p-4">Nama</th><th>Email</th><th>Role</th><th>NIM/NIP</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{users.data.map((user) => <tr key={user.id} className="border-t border-slate-100"><td className="p-4 font-semibold">{user.fullName}</td><td>{user.email}</td><td><StatusBadge value={user.role} /></td><td>{user.nimNip ?? '-'}</td><td><StatusBadge value={user.isActive ? 'aktif' : 'nonaktif'} /></td><td><Link href={`/admin/users/${user.id}/toggle-active`} method="post" as="button" className="font-semibold text-primary">{user.isActive ? 'Nonaktifkan' : 'Aktifkan'}</Link></td></tr>)}</tbody></table></div>
    </AdminLayout>
  )
}
