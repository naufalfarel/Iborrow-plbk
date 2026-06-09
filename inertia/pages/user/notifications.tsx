import { Head, Link } from '@inertiajs/react'
import UserLayout from '../../components/UserLayout'
import type { Notification, Paginated } from '../../types'

export default function Notifications({ notifications }: { notifications: Paginated<Notification> }) {
  return (
    <UserLayout>
      <Head title="Notifikasi" />
      <h1 className="mb-6 text-3xl font-black">Notifikasi</h1>
      <div className="space-y-3">{notifications.data.map((item) => <div key={item.id} className="card flex flex-col justify-between gap-3 p-5 md:flex-row md:items-center"><div><h2 className="font-bold">{item.title}</h2><p className="mt-1 text-sm text-slate-600">{item.message}</p></div>{!item.isRead && <Link href={`/notifications/${item.id}/read`} method="post" as="button" className="btn-secondary">Tandai dibaca</Link>}</div>)}</div>
    </UserLayout>
  )
}
