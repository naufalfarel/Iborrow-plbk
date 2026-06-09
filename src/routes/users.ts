import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import { requireRole } from '../middleware/role.js'
import { flashMessage } from '../inertia.js'

const router = Router()

router.use('/admin/users', authMiddleware, requireRole('admin', 'staf'))

router.get('/admin/users', async (req, res) => {
  const search = (req.query.search as string) || ''
  const role = (req.query.role as string) || 'Semua'
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = 15
  const offset = (page - 1) * limit

  try {
    let whereClause = ''
    const values: any[] = []
    const conditions: string[] = []

    if (search) {
      values.push(`%${search}%`)
      conditions.push(`(full_name ILIKE $${values.length} OR email ILIKE $${values.length})`)
    }

    if (role !== 'Semua') {
      values.push(role)
      conditions.push(`role = $${values.length}`)
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ')
    }

    const totalRes = await pool.query(`SELECT COUNT(*) as total FROM users ${whereClause}`, values)
    const total = Number(totalRes.rows[0].total)

    const usersRes = await pool.query(`
      SELECT * FROM users ${whereClause} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `, [...values, limit, offset])

    const formatUser = (row: any) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      nimNip: row.nim_nip,
      isActive: row.is_active
    })

    req.inertia.render('admin/users/index', {
      users: { meta: { total, perPage: limit, currentPage: page, lastPage: Math.ceil(total / limit) }, data: usersRes.rows.map(formatUser) },
      filters: { search, role }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.post('/admin/users/:id/toggle-active', async (req, res) => {
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id])
    if (userRes.rows.length === 0) return res.status(404).send('Not Found')
    const user = userRes.rows[0]

    if (user.id === req.user!.id) {
      flashMessage(req, 'error', 'Kamu tidak bisa menonaktifkan akun sendiri.')
      return res.redirect('back')
    }

    const newIsActive = !user.is_active
    await pool.query('UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2', [newIsActive, user.id])
    
    flashMessage(req, 'success', `Status akun ${user.full_name} berhasil diperbarui.`)
    res.redirect('/admin/users')
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

export default router
