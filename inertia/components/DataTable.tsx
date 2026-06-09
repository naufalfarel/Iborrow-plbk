import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
}

export default function DataTable<T extends { id: number }>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3">{column.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 && <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={columns.length}>Belum ada data.</td></tr>}
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              {columns.map((column) => <td key={column.key} className="px-4 py-3 align-top">{column.render(row)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
