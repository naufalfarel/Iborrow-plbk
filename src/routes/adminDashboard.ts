import { Router } from 'express'
import pool from '../db.js'
import { requireRole } from '../middleware/role.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/admin', authMiddleware, requireRole('admin', 'staf'), async (req, res) => {
  try {
    const totalItemsQuery = pool.query('SELECT COUNT(*) as total FROM items WHERE is_active = true')
    const pendingQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE status = 'menunggu'")
    const activeUsersQuery = pool.query('SELECT COUNT(*) as total FROM users WHERE is_active = true')
    const returnedQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE status = 'dikembalikan'")
    const totalBorrowsQuery = pool.query('SELECT COUNT(*) as total FROM borrows')
    const lateQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE status = 'terlambat'")
    const todayRequestsQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE borrow_date = CURRENT_DATE")

    const weeklyQuery = pool.query(`
      SELECT to_char(days.day, 'Dy') as day,
        COALESCE(b.borrow_count, 0)::int as borrow_count,
        COALESCE(r.return_count, 0)::int as return_count
      FROM generate_series(current_date - interval '6 days', current_date, interval '1 day') as days(day)
      LEFT JOIN (
        SELECT borrow_date, COUNT(*) as borrow_count FROM borrows GROUP BY borrow_date
      ) b ON b.borrow_date = days.day::date
      LEFT JOIN (
        SELECT actual_return_date, COUNT(*) as return_count FROM borrows WHERE actual_return_date IS NOT NULL GROUP BY actual_return_date
      ) r ON r.actual_return_date = days.day::date
      ORDER BY days.day ASC
    `)

    const categoriesQuery = pool.query('SELECT category, COUNT(*)::int as total FROM items WHERE is_active = true GROUP BY category')
    
    const topItemsQuery = pool.query(`
      SELECT i.name, COUNT(b.id)::int as borrow_count 
      FROM items i 
      LEFT JOIN borrows b ON i.id = b.item_id 
      GROUP BY i.id, i.name 
      ORDER BY borrow_count DESC 
      LIMIT 4
    `)

    const latestPendingQuery = pool.query(`
      SELECT b.*, 
        row_to_json(u.*) as user,
        row_to_json(i.*) as item
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN items i ON b.item_id = i.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `)

    const recentActivityQuery = pool.query(`
      SELECT id, title, message, type, created_at as time
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 5
    `)

    const [totalItems, pending, activeUsers, returned, totalBorrows, late, todayRequests, weekly, categories, topItems, latestPending, activities] = await Promise.all([
      totalItemsQuery, pendingQuery, activeUsersQuery, returnedQuery, totalBorrowsQuery, lateQuery, todayRequestsQuery, weeklyQuery, categoriesQuery, topItemsQuery, latestPendingQuery, recentActivityQuery
    ])

    const totalBorrowCount = Number(totalBorrows.rows[0].total)
    const returnRate = totalBorrowCount > 0 ? Math.round((Number(returned.rows[0].total) / totalBorrowCount) * 100) : 0

    const formatBorrow = (row: any) => ({
      id: row.id,
      borrowCode: row.borrow_code,
      userId: row.user_id,
      itemId: row.item_id,
      status: row.status,
      borrowDate: row.borrow_date,
      returnDate: row.return_date,
      user: row.user ? { fullName: row.user.full_name, nimNip: row.user.nim_nip } : null,
      item: row.item ? { name: row.item.name } : null
    })

    req.inertia.render('admin/dashboard', {
      stats: {
        totalItems: Number(totalItems.rows[0].total),
        pending: Number(pending.rows[0].total),
        activeUsers: Number(activeUsers.rows[0].total),
        returnRate,
        late: Number(late.rows[0].total),
        todayRequests: Number(todayRequests.rows[0].total)
      },
      weekly: weekly.rows,
      categories: categories.rows,
      topItems: topItems.rows,
      latestBorrows: latestPending.rows.map(formatBorrow),
      activities: activities.rows
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

export default router
