import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const totalItemsQuery = pool.query('SELECT COUNT(*) as total FROM items WHERE is_active = true')
    const totalUsersQuery = pool.query('SELECT COUNT(*) as total FROM users WHERE is_active = true')
    const activeBorrowsQuery = pool.query("SELECT COUNT(*) as total FROM borrows WHERE status IN ('menunggu', 'disetujui', 'dipinjam', 'terlambat')")

    const [itemsRes, usersRes, borrowsRes] = await Promise.all([totalItemsQuery, totalUsersQuery, activeBorrowsQuery])

    req.inertia.render('landing', {
      stats: {
        totalItems: Number(itemsRes.rows[0].total),
        totalUsers: Number(usersRes.rows[0].total),
        activeBorrows: Number(borrowsRes.rows[0].total)
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

export default router
