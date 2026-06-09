import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.id

    const activeQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE user_id = $1 AND status IN ('disetujui', 'dipinjam', 'terlambat')", [userId])
    const pendingQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE user_id = $1 AND status = 'menunggu'", [userId])
    const totalQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE user_id = $1", [userId])
    const lateQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE user_id = $1 AND status = 'terlambat'", [userId])

    const latestBorrowsQuery = pool.query(`
      SELECT b.*, 
        row_to_json(i.*) as item
      FROM borrows b
      LEFT JOIN items i ON b.item_id = i.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
      LIMIT 10
    `, [userId])

    const activeBorrowsQuery = pool.query(`
      SELECT b.*, 
        row_to_json(i.*) as item
      FROM borrows b
      LEFT JOIN items i ON b.item_id = i.id
      WHERE b.user_id = $1 AND b.status IN ('disetujui', 'dipinjam', 'terlambat')
      ORDER BY b.return_date ASC
    `, [userId])

    const notificationsQuery = pool.query(`
      SELECT * FROM notifications 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    `, [userId])

    const categoriesQuery = pool.query(`
      SELECT category, COUNT(*)::int as total 
      FROM items 
      WHERE is_active = true 
      GROUP BY category
    `)

    const recommendationsQuery = pool.query(`
      SELECT * FROM items 
      WHERE is_active = true AND stock_available > 0
      ORDER BY RANDOM() 
      LIMIT 4
    `)

    const [activeRes, pendingRes, totalRes, lateRes, borrowsRes, activeBorrowsRes, notifsRes, categoriesRes, recommendationsRes] = await Promise.all([
      activeQuery, pendingQuery, totalQuery, lateQuery, latestBorrowsQuery, activeBorrowsQuery, notificationsQuery, categoriesQuery, recommendationsQuery
    ])

    const formatBorrow = (row: any) => ({
      id: row.id,
      borrowCode: row.borrow_code,
      userId: row.user_id,
      itemId: row.item_id,
      quantity: row.quantity,
      borrowDate: row.borrow_date,
      returnDate: row.return_date,
      actualReturnDate: row.actual_return_date,
      status: row.status,
      purpose: row.purpose,
      notes: row.notes,
      itemConditionOnReturn: row.item_condition_on_return,
      item: row.item ? {
        id: row.item.id,
        code: row.item.code,
        name: row.item.name,
        category: row.item.category,
        stockTotal: row.item.stock_total,
        stockAvailable: row.item.stock_available,
        condition: row.item.condition,
        imageUrl: row.item.image_url,
        isActive: row.item.is_active
      } : null
    })

    const formatNotif = (row: any) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type,
      isRead: row.is_read,
      createdAt: row.created_at
    })

    const formatItem = (row: any) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      category: row.category,
      stockTotal: row.stock_total,
      stockAvailable: row.stock_available,
      imageUrl: row.image_url,
    })

    const lateCount = Number(lateRes.rows[0].total)
    let reputationScore = 100 - (lateCount * 5)
    if (reputationScore < 0) reputationScore = 0

    req.inertia.render('user/dashboard', {
      stats: {
        active: Number(activeRes.rows[0].total),
        pending: Number(pendingRes.rows[0].total),
        total: Number(totalRes.rows[0].total),
        late: lateCount,
        reputation: reputationScore
      },
      categories: categoriesRes.rows,
      recommendations: recommendationsRes.rows.map(formatItem),
      activeBorrowsList: activeBorrowsRes.rows.map(formatBorrow),
      latestBorrows: borrowsRes.rows.map(formatBorrow),
      notifications: notifsRes.rows.map(formatNotif)
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

export default router
