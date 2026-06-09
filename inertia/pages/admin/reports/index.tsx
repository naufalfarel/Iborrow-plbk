import { Head } from '@inertiajs/react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AdminLayout from '../../../components/AdminLayout'
import StatusBadge from '../../../components/StatusBadge'
import type { Borrow } from '../../../types'

interface MonthlyRow { month: string; total: number }
interface TopItem { code: string; name: string; category: string; total: number }

export default function Reports({ summary, monthly, topItems, lateBorrows }: { summary: { monthTotal: number; returned: number; overdue: number; pending: number }; monthly: MonthlyRow[]; category: { category: string; total: number }[]; topItems: TopItem[]; lateBorrows: Borrow[] }) {
  return (
    <AdminLayout title="Laporan"><Head title="Laporan" />
      <div className="mb-5 flex justify-end"><a href="/admin/reports/export" className="btn-primary">Export CSV</a></div>
      <div className="grid gap-4 md:grid-cols-4">{[['Bulan Ini', summary.monthTotal], ['Dikembalikan', summary.returned], ['Terlambat', summary.overdue], ['Pending', summary.pending]].map(([label, value]) => <div key={label} className="card p-5"><div className="text-sm font-semibold text-slate-500">{label}</div><div className="mt-2 text-3xl font-black text-primary">{value}</div></div>)}</div>
      <div className="card mt-6 p-6"><h2 className="font-bold">Peminjaman 6 Bulan Terakhir</h2><div className="mt-4 h-72"><ResponsiveContainer><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="total" name="Peminjaman" /></BarChart></ResponsiveContainer></div></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2"><div className="card p-6"><h2 className="mb-4 font-bold">Top 5 Alat</h2><table className="w-full text-sm"><tbody>{topItems.map((item) => <tr key={item.code} className="border-t border-slate-100"><td className="py-3 font-semibold">{item.name}</td><td>{item.category}</td><td className="text-right font-bold">{item.total}</td></tr>)}</tbody></table></div><div className="card p-6"><h2 className="mb-4 font-bold">Keterlambatan</h2><table className="w-full text-sm"><tbody>{lateBorrows.map((borrow) => <tr key={borrow.id} className="border-t border-slate-100"><td className="py-3 font-semibold">{borrow.borrowCode}</td><td>{borrow.user?.fullName}</td><td>{borrow.item?.name}</td><td><StatusBadge value={borrow.status} /></td></tr>)}</tbody></table></div></div>
    </AdminLayout>
  )
}
