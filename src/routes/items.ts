import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import { requireRole } from '../middleware/role.js'
import { flashMessage } from '../inertia.js'

const router = Router()

// format mapping
const formatItem = (row: any) => ({
  id: row.id,
  code: row.code,
  name: row.name,
  category: row.category,
  description: row.description,
  stockTotal: row.stock_total,
  stockAvailable: row.stock_available,
  condition: row.condition,
  imageUrl: row.image_url,
  isActive: row.is_active
})

// === USER ROUTES ===
router.get('/items', authMiddleware, async (req, res) => {
  const search = (req.query.search as string) || ''
  const category = (req.query.category as string) || 'Semua'
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = 12
  const offset = (page - 1) * limit

  try {
    let whereClause = 'WHERE is_active = true'
    const values: any[] = []
    
    if (search) {
      values.push(`%${search}%`)
      whereClause += ` AND name ILIKE $${values.length}`
    }
    
    if (category && category !== 'Semua') {
      values.push(category)
      whereClause += ` AND category = $${values.length}`
    }

    const countQuery = `SELECT COUNT(*) as total FROM items ${whereClause}`
    const totalRes = await pool.query(countQuery, values)
    const total = Number(totalRes.rows[0].total)
    const lastPage = Math.ceil(total / limit)

    const itemsQuery = `SELECT * FROM items ${whereClause} ORDER BY name ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    const itemsRes = await pool.query(itemsQuery, [...values, limit, offset])

    req.inertia.render('user/items', {
      items: {
        meta: { total, perPage: limit, currentPage: page, lastPage },
        data: itemsRes.rows.map(formatItem)
      },
      filters: { search, category }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.get('/borrow/:id', authMiddleware, async (req, res) => {
  try {
    const itemRes = await pool.query('SELECT * FROM items WHERE id = $1', [req.params.id])
    if (itemRes.rows.length === 0) return res.status(404).send('Not Found')
    
    const item = itemRes.rows[0]
    if (!item.is_active || item.stock_available <= 0 || item.condition === 'rusak_berat') {
      flashMessage(req, 'error', 'Alat tidak tersedia untuk dipinjam.')
      return res.redirect('/items')
    }

    req.inertia.render('user/borrow_form', { item: formatItem(item) })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.get('/items/:id', authMiddleware, async (req, res) => {
  // Redirect to borrow form — /items/:id is an alias for /borrow/:id
  return res.redirect(`/borrow/${req.params.id}`)
})

// === ADMIN ROUTES ===
router.use('/admin/items', authMiddleware, requireRole('admin', 'staf'))

router.get('/admin/items', async (req, res) => {
  const search = (req.query.search as string) || ''
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = 15
  const offset = (page - 1) * limit

  try {
    let whereClause = ''
    const values: any[] = []
    
    if (search) {
      values.push(`%${search}%`)
      whereClause = `WHERE name ILIKE $1 OR code ILIKE $1`
    }

    const totalRes = await pool.query(`SELECT COUNT(*) as total FROM items ${whereClause}`, values)
    const total = Number(totalRes.rows[0].total)
    const lastPage = Math.ceil(total / limit)

    const itemsQuery = `SELECT * FROM items ${whereClause} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    const itemsRes = await pool.query(itemsQuery, [...values, limit, offset])

    req.inertia.render('admin/items/index', {
      items: {
        meta: { total, perPage: limit, currentPage: page, lastPage },
        data: itemsRes.rows.map(formatItem)
      },
      filters: { search }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.get('/admin/items/create', (req, res) => {
  req.inertia.render('admin/items/create')
})

router.post('/admin/items', async (req, res) => {
  const { code, name, category, description, stock_total, stock_available, condition, image_url } = req.body
  const finalStockAvailable = stock_available ?? stock_total

  if (finalStockAvailable > stock_total) {
    flashMessage(req, 'error', 'Stok tersedia tidak boleh lebih besar dari stok total.')
    return res.redirect('back')
  }

  try {
    await pool.query(
      `INSERT INTO items (code, name, category, description, stock_total, stock_available, condition, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)`,
      [code, name, category, description, stock_total, finalStockAvailable, condition, image_url]
    )
    flashMessage(req, 'success', 'Data alat berhasil ditambahkan.')
    res.redirect('/admin/items')
  } catch (err) {
    console.error(err)
    flashMessage(req, 'error', 'Gagal menyimpan alat (Mungkin kode duplikat).')
    res.redirect('back')
  }
})

router.get('/admin/items/:id/edit', async (req, res) => {
  try {
    const itemRes = await pool.query('SELECT * FROM items WHERE id = $1', [req.params.id])
    if (itemRes.rows.length === 0) return res.status(404).send('Not Found')
    req.inertia.render('admin/items/edit', { item: formatItem(itemRes.rows[0]) })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.put('/admin/items/:id', async (req, res) => {
  const { code, name, category, description, stock_total, stock_available, condition, image_url, is_active } = req.body

  if (stock_available > stock_total) {
    flashMessage(req, 'error', 'Stok tersedia tidak boleh lebih besar dari stok total.')
    return res.redirect('back')
  }

  try {
    await pool.query(
      `UPDATE items SET code=$1, name=$2, category=$3, description=$4, stock_total=$5, stock_available=$6, condition=$7, image_url=$8, is_active=$9, updated_at=NOW()
       WHERE id=$10`,
      [code, name, category, description, stock_total, stock_available, condition, image_url, is_active, req.params.id]
    )
    flashMessage(req, 'success', 'Data alat berhasil diperbarui.')
    res.redirect('/admin/items')
  } catch (err) {
    console.error(err)
    flashMessage(req, 'error', 'Gagal memperbarui alat.')
    res.redirect('back')
  }
})

router.delete('/admin/items/:id', async (req, res) => {
  try {
    await pool.query('UPDATE items SET is_active=false, updated_at=NOW() WHERE id=$1', [req.params.id])
    flashMessage(req, 'success', 'Alat berhasil dinonaktifkan dari daftar inventaris.')
    res.redirect('/admin/items')
  } catch (err) {
    console.error(err)
    flashMessage(req, 'error', 'Gagal menghapus alat.')
    res.redirect('back')
  }
})

export default router
