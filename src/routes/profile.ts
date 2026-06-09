import { Router } from 'express'
import bcrypt from 'bcrypt'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import { flashMessage } from '../inertia.js'

const router = Router()

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.id

    // Borrow stats
    const statsRes = await pool.query(`
      SELECT
        COUNT(*)::int                                                                 AS total,
        COUNT(*) FILTER (WHERE status = 'dikembalikan')::int                        AS returned,
        COUNT(*) FILTER (WHERE status IN ('disetujui','dipinjam','terlambat'))::int AS active,
        COUNT(*) FILTER (WHERE status = 'terlambat' OR actual_return_date > return_date)::int AS late
      FROM borrows WHERE user_id = $1
    `, [userId])

    const stats = statsRes.rows[0]
    const onTime = stats.returned - stats.late < 0 ? 0 : stats.returned - stats.late
    let reputation = 100 - stats.late * 5
    if (reputation < 0) reputation = 0

    // User info
    const userRes = await pool.query(
      'SELECT id, full_name, email, role, nim_nip, created_at FROM users WHERE id = $1',
      [userId]
    )
    const user = userRes.rows[0]

    req.inertia.render('user/profile', {
      profileUser: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        nimNip: user.nim_nip,
        createdAt: user.created_at,
      },
      stats: {
        total: stats.total,
        returned: stats.returned,
        active: stats.active,
        late: stats.late,
        onTime,
        reputation,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

// Update profile info
router.post('/profile/update', authMiddleware, async (req, res) => {
  const { full_name, nim_nip } = req.body
  if (!full_name) {
    flashMessage(req, 'error', 'Nama tidak boleh kosong.')
    return res.redirect('/profile')
  }
  try {
    await pool.query(
      'UPDATE users SET full_name = $1, nim_nip = $2, updated_at = NOW() WHERE id = $3',
      [full_name, nim_nip || null, req.user!.id]
    )
    // Update session user
    req.user!.fullName = full_name
    flashMessage(req, 'success', 'Profil berhasil diperbarui.')
    res.redirect('/profile')
  } catch (err) {
    console.error(err)
    flashMessage(req, 'error', 'Gagal memperbarui profil.')
    res.redirect('/profile')
  }
})

// Change password
router.post('/profile/change-password', authMiddleware, async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body
  if (new_password !== confirm_password) {
    flashMessage(req, 'error', 'Konfirmasi password baru tidak cocok.')
    return res.redirect('/profile')
  }
  if (new_password.length < 8) {
    flashMessage(req, 'error', 'Password baru minimal 8 karakter.')
    return res.redirect('/profile')
  }
  try {
    const userRes = await pool.query('SELECT password FROM users WHERE id = $1', [req.user!.id])
    const valid = await bcrypt.compare(current_password, userRes.rows[0].password)
    if (!valid) {
      flashMessage(req, 'error', 'Password saat ini tidak valid.')
      return res.redirect('/profile')
    }
    const hash = await bcrypt.hash(new_password, 10)
    await pool.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hash, req.user!.id])
    flashMessage(req, 'success', 'Password berhasil diubah.')
    res.redirect('/profile')
  } catch (err) {
    console.error(err)
    flashMessage(req, 'error', 'Gagal mengubah password.')
    res.redirect('/profile')
  }
})

export default router
