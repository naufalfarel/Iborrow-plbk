import { Router } from 'express'
import { DateTime } from 'luxon'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import { requireRole } from '../middleware/role.js'

const router = Router()

router.use('/admin/reports', authMiddleware, requireRole('admin', 'staf'))

router.get('/admin/reports', async (req, res) => {
  try {
    const startOfMonth = DateTime.local().startOf('month').toSQLDate()

    const monthTotalQuery = pool.query('SELECT COUNT(*) as total FROM borrows WHERE created_at >= $1', [startOfMonth])
    const returnedQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE status = 'dikembalikan' AND created_at >= $1", [startOfMonth])
    const overdueQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE status = 'terlambat'")
    const pendingQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE status = 'menunggu'")

    const monthlyQuery = pool.query(`
      SELECT to_char(date_trunc('month', created_at), 'Mon YYYY') as month, COUNT(*)::int as total
      FROM borrows
      WHERE created_at >= date_trunc('month', current_date) - interval '5 months'
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at)
    `)

    const categoryQuery = pool.query(`
      SELECT items.category, COUNT(borrows.id)::int as total
      FROM borrows JOIN items ON items.id = borrows.item_id
      GROUP BY items.category ORDER BY total DESC
    `)

    const topItemsQuery = pool.query(`
      SELECT items.code, items.name, items.category, COUNT(borrows.id)::int as total
      FROM borrows JOIN items ON items.id = borrows.item_id
      GROUP BY items.id ORDER BY total DESC LIMIT 5
    `)

    const lateBorrowsQuery = pool.query(`
      SELECT b.*, row_to_json(u.*) as user, row_to_json(i.*) as item
      FROM borrows b 
      JOIN users u ON b.user_id = u.id 
      JOIN items i ON b.item_id = i.id
      WHERE b.status = 'terlambat'
      ORDER BY b.return_date ASC LIMIT 20
    `)

    const [monthTotal, returned, overdue, pending, monthly, category, topItems, lateBorrows] = await Promise.all([
      monthTotalQuery, returnedQuery, overdueQuery, pendingQuery, monthlyQuery, categoryQuery, topItemsQuery, lateBorrowsQuery
    ])

    const formatBorrow = (row: any) => ({
      id: row.id,
      borrowCode: row.borrow_code,
      status: row.status,
      user: row.user ? { fullName: row.user.full_name } : null,
      item: row.item ? { name: row.item.name } : null
    })

    req.inertia.render('admin/reports/index', {
      summary: {
        monthTotal: Number(monthTotal.rows[0].total),
        returned: Number(returned.rows[0].total),
        overdue: Number(overdue.rows[0].total),
        pending: Number(pending.rows[0].total)
      },
      monthly: monthly.rows,
      category: category.rows,
      topItems: topItems.rows,
      lateBorrows: lateBorrows.rows.map(formatBorrow)
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.get('/admin/reports/export', async (req, res) => {
  try {
    const borrowsRes = await pool.query(`
      SELECT b.*, u.full_name, u.role, i.name as item_name
      FROM borrows b 
      JOIN users u ON b.user_id = u.id 
      JOIN items i ON b.item_id = i.id
      ORDER BY b.created_at DESC
    `)

    const header = ['Kode', 'Peminjam', 'Role', 'Alat', 'Tanggal Pinjam', 'Tanggal Kembali', 'Status', 'Tujuan']
    
    const rows = borrowsRes.rows.map((borrow) => [
      borrow.borrow_code,
      borrow.full_name,
      borrow.role,
      borrow.item_name,
      DateTime.fromJSDate(borrow.borrow_date).toISODate(),
      DateTime.fromJSDate(borrow.return_date).toISODate(),
      borrow.status,
      (borrow.purpose || '').replace(/\n/g, ' ')
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="iborrow-report-${DateTime.local().toISODate()}.csv"`)
    res.send(csv)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

export default router
