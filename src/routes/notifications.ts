import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import { flashMessage } from '../inertia.js'

const router = Router()

router.get('/notifications', authMiddleware, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = 15
  const offset = (page - 1) * limit
  const userId = req.user!.id

  try {
    const totalRes = await pool.query('SELECT COUNT(*) as total FROM notifications WHERE user_id = $1', [userId])
    const total = Number(totalRes.rows[0].total)
    
    const notifsRes = await pool.query(`
      SELECT n.*, row_to_json(b.*) as borrow
      FROM notifications n
      LEFT JOIN borrows b ON n.related_borrow_id = b.id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset])

    const formatNotif = (row: any) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type,
      isRead: row.is_read,
      createdAt: row.created_at,
      borrow: row.borrow ? {
        id: row.borrow.id,
        borrowCode: row.borrow.borrow_code,
        status: row.borrow.status
      } : null
    })

    const lastPage = Math.ceil(total / limit)
    
    req.inertia.render('user/notifications', {
      notifications: {
        meta: { total, perPage: limit, currentPage: page, lastPage },
        data: notifsRes.rows.map(formatNotif)
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.post('/notifications/:id/read', authMiddleware, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [id, req.user!.id])
    flashMessage(req, 'success', 'Notifikasi ditandai sudah dibaca.')
    res.redirect('back')
  } catch (err) {
    console.error(err)
    flashMessage(req, 'error', 'Gagal update notifikasi.')
    res.redirect('back')
  }
})

export default router
