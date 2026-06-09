import { Router } from 'express'
import { DateTime } from 'luxon'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import { requireRole } from '../middleware/role.js'
import { flashMessage } from '../inertia.js'

const router = Router()

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
  user: row.user ? { fullName: row.user.full_name, role: row.user.role, nimNip: row.user.nim_nip } : undefined,
  item: row.item ? { name: row.item.name, code: row.item.code, category: row.item.category } : undefined,
  reviewer: row.reviewer ? { fullName: row.reviewer.full_name } : undefined
})

// === USER ROUTES ===
router.post('/borrow', authMiddleware, async (req, res) => {
  const { item_id, quantity, borrow_date, return_date, purpose } = req.body
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const itemRes = await client.query('SELECT * FROM items WHERE id = $1 FOR UPDATE', [item_id])
    if (itemRes.rows.length === 0) throw new Error('Item not found')
    
    const item = itemRes.rows[0]
    if (!item.is_active || item.stock_available < quantity || item.condition === 'rusak_berat') {
      await client.query('ROLLBACK')
      flashMessage(req, 'error', 'Stok alat tidak mencukupi atau alat sedang tidak tersedia.')
      return res.redirect('back')
    }

    await client.query('UPDATE items SET stock_available = stock_available - $1 WHERE id = $2', [quantity, item_id])

    const borrowCode = `B-${DateTime.now().toFormat('yyyyLLddHHmmss')}-${req.user!.id}`
    const borrowRes = await client.query(
      `INSERT INTO borrows (borrow_code, user_id, item_id, quantity, borrow_date, return_date, status, purpose)
       VALUES ($1, $2, $3, $4, $5, $6, 'menunggu', $7) RETURNING id`,
      [borrowCode, req.user!.id, item_id, quantity, borrow_date, return_date, purpose]
    )
    const borrowId = borrowRes.rows[0].id

    // Notify Admins
    const adminsRes = await client.query("SELECT id FROM users WHERE role IN ('admin', 'staf') AND is_active = true")
    for (const admin of adminsRes.rows) {
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, related_borrow_id) VALUES ($1, $2, $3, 'info', $4)`,
        [admin.id, 'Permintaan peminjaman baru', `Ada permintaan baru dari ${req.user!.fullName} untuk ${item.name}.`, borrowId]
      )
    }

    await client.query('COMMIT')
    flashMessage(req, 'success', 'Pengajuan peminjaman berhasil dikirim dan menunggu validasi staf/admin.')
    res.redirect('/my-borrows')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    flashMessage(req, 'error', 'Terjadi kesalahan sistem saat peminjaman.')
    res.redirect('back')
  } finally {
    client.release()
  }
})

router.get('/my-borrows', authMiddleware, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = 15
  const offset = (page - 1) * limit
  const userId = req.user!.id

  try {
    const totalRes = await pool.query("SELECT COUNT(*) as total FROM borrows WHERE user_id = $1 AND status IN ('menunggu', 'disetujui', 'dipinjam', 'terlambat')", [userId])
    const total = Number(totalRes.rows[0].total)
    
    const borrowsRes = await pool.query(`
      SELECT b.*, row_to_json(i.*) as item
      FROM borrows b LEFT JOIN items i ON b.item_id = i.id
      WHERE b.user_id = $1 AND b.status IN ('menunggu', 'disetujui', 'dipinjam', 'terlambat')
      ORDER BY b.created_at DESC LIMIT $2 OFFSET $3
    `, [userId, limit, offset])

    req.inertia.render('user/my_borrows', {
      borrows: { meta: { total, perPage: limit, currentPage: page, lastPage: Math.ceil(total / limit) }, data: borrowsRes.rows.map(formatBorrow) }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.get('/history', authMiddleware, async (req, res) => {
  const status = (req.query.status as string) || 'Semua'
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = 15
  const offset = (page - 1) * limit
  const userId = req.user!.id

  try {
    let whereClause = 'WHERE b.user_id = $1'
    const values: any[] = [userId]
    
    if (status !== 'Semua') {
      values.push(status)
      whereClause += ' AND b.status = $2'
    }

    const totalRes = await pool.query(`SELECT COUNT(*) as total FROM borrows b ${whereClause}`, values)
    const total = Number(totalRes.rows[0].total)

    const borrowsRes = await pool.query(`
      SELECT b.*, row_to_json(i.*) as item
      FROM borrows b LEFT JOIN items i ON b.item_id = i.id
      ${whereClause} ORDER BY b.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `, [...values, limit, offset])

    req.inertia.render('user/history', {
      borrows: { meta: { total, perPage: limit, currentPage: page, lastPage: Math.ceil(total / limit) }, data: borrowsRes.rows.map(formatBorrow) },
      filters: { status }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.post('/borrow/:id/extend', authMiddleware, async (req, res) => {
  const { return_date } = req.body
  try {
    const borrowRes = await pool.query(`
      SELECT b.*, i.name as item_name FROM borrows b JOIN items i ON b.item_id = i.id 
      WHERE b.id = $1 AND b.user_id = $2
    `, [req.params.id, req.user!.id])
    
    if (borrowRes.rows.length === 0) return res.status(404).send('Not Found')
    const borrow = borrowRes.rows[0]

    if (!['disetujui', 'dipinjam'].includes(borrow.status)) {
      flashMessage(req, 'error', 'Peminjaman hanya bisa diperpanjang saat status disetujui atau dipinjam.')
      return res.redirect('back')
    }

    await pool.query('UPDATE borrows SET return_date = $1, updated_at = NOW() WHERE id = $2', [return_date, borrow.id])
    
    const adminsRes = await pool.query("SELECT id FROM users WHERE role IN ('admin', 'staf') AND is_active = true")
    for (const admin of adminsRes.rows) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, related_borrow_id) VALUES ($1, $2, $3, 'info', $4)`,
        [admin.id, 'Permintaan perpanjangan', `${req.user!.fullName} memperpanjang peminjaman ${borrow.item_name}.`, borrow.id]
      )
    }

    flashMessage(req, 'success', 'Tanggal pengembalian berhasil diperpanjang.')
    res.redirect('/my-borrows')
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.get('/my-borrows/:id', authMiddleware, async (req, res) => {
  try {
    const borrowRes = await pool.query(`
      SELECT b.*, row_to_json(i.*) as item
      FROM borrows b LEFT JOIN items i ON b.item_id = i.id
      WHERE b.id = $1 AND b.user_id = $2
    `, [req.params.id, req.user!.id])

    if (borrowRes.rows.length === 0) {
      flashMessage(req, 'error', 'Data peminjaman tidak ditemukan.')
      return res.redirect('/my-borrows')
    }

    req.inertia.render('user/borrow_detail', { borrow: formatBorrow(borrowRes.rows[0]) })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.post('/my-borrows/:id/return-request', authMiddleware, async (req, res) => {
  try {
    const borrowRes = await pool.query(
      'SELECT * FROM borrows WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user!.id]
    )
    if (borrowRes.rows.length === 0) {
      flashMessage(req, 'error', 'Data peminjaman tidak ditemukan.')
      return res.redirect('/my-borrows')
    }
    const borrow = borrowRes.rows[0]
    if (!['disetujui', 'dipinjam', 'terlambat'].includes(borrow.status)) {
      flashMessage(req, 'error', 'Status peminjaman tidak memungkinkan pengembalian.')
      return res.redirect('/my-borrows')
    }
    // Notify admins about return request
    const adminsRes = await pool.query("SELECT id FROM users WHERE role IN ('admin', 'staf') AND is_active = true")
    const itemRes = await pool.query('SELECT name FROM items WHERE id = $1', [borrow.item_id])
    for (const admin of adminsRes.rows) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, related_borrow_id) VALUES ($1, $2, $3, 'info', $4)`,
        [admin.id, 'Permintaan pengembalian', `${req.user!.fullName} ingin mengembalikan ${itemRes.rows[0]?.name}. Konfirmasi di halaman peminjaman.`, borrow.id]
      )
    }
    flashMessage(req, 'success', 'Permintaan pengembalian telah dikirim ke admin/staf lab.')
    res.redirect('/my-borrows')
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

// === ADMIN ROUTES ===
router.use('/admin/borrows', authMiddleware, requireRole('admin', 'staf'))

router.get('/admin/borrows', async (req, res) => {
  const status = (req.query.status as string) || 'Semua'
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = 15
  const offset = (page - 1) * limit

  try {
    let whereClause = ''
    const values: any[] = []
    
    if (status !== 'Semua') {
      values.push(status)
      whereClause = 'WHERE b.status = $1'
    }

    const totalRes = await pool.query(`SELECT COUNT(*) as total FROM borrows b ${whereClause}`, values)
    const total = Number(totalRes.rows[0].total)

    const borrowsRes = await pool.query(`
      SELECT b.*, row_to_json(i.*) as item, row_to_json(u.*) as user
      FROM borrows b 
      LEFT JOIN items i ON b.item_id = i.id
      LEFT JOIN users u ON b.user_id = u.id
      ${whereClause} ORDER BY b.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `, [...values, limit, offset])

    req.inertia.render('admin/borrows/index', {
      borrows: { meta: { total, perPage: limit, currentPage: page, lastPage: Math.ceil(total / limit) }, data: borrowsRes.rows.map(formatBorrow) },
      filters: { status }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.get('/admin/borrows/:id', async (req, res) => {
  try {
    const borrowRes = await pool.query(`
      SELECT b.*, 
        row_to_json(i.*) as item, 
        row_to_json(u.*) as user,
        row_to_json(r.*) as reviewer
      FROM borrows b 
      LEFT JOIN items i ON b.item_id = i.id
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN users r ON b.reviewed_by = r.id
      WHERE b.id = $1
    `, [req.params.id])
    
    if (borrowRes.rows.length === 0) return res.status(404).send('Not Found')
    req.inertia.render('admin/borrows/detail', { borrow: formatBorrow(borrowRes.rows[0]) })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.post('/admin/borrows/:id/approve', async (req, res) => {
  const { notes } = req.body
  try {
    const borrowRes = await pool.query('SELECT * FROM borrows WHERE id = $1', [req.params.id])
    if (borrowRes.rows.length === 0) return res.status(404).send('Not Found')
    const borrow = borrowRes.rows[0]

    if (borrow.status !== 'menunggu') {
      flashMessage(req, 'error', 'Peminjaman ini sudah diproses sebelumnya.')
      return res.redirect('back')
    }

    await pool.query(
      `UPDATE borrows SET status = 'disetujui', reviewed_by = $1, reviewed_at = NOW(), notes = $2, updated_at = NOW() WHERE id = $3`,
      [req.user!.id, notes || null, borrow.id]
    )

    const itemRes = await pool.query('SELECT name FROM items WHERE id = $1', [borrow.item_id])
    
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, related_borrow_id) VALUES ($1, $2, $3, 'approved', $4)`,
      [borrow.user_id, 'Peminjaman disetujui', `Peminjaman ${itemRes.rows[0].name} disetujui. Silakan ambil alat sesuai prosedur lab.`, borrow.id]
    )

    flashMessage(req, 'success', 'Peminjaman berhasil disetujui.')
    res.redirect('/admin/borrows')
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.post('/admin/borrows/:id/reject', async (req, res) => {
  const { notes } = req.body
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const borrowRes = await client.query('SELECT * FROM borrows WHERE id = $1 FOR UPDATE', [req.params.id])
    if (borrowRes.rows.length === 0) throw new Error('Not Found')
    const borrow = borrowRes.rows[0]

    if (borrow.status !== 'menunggu') {
      await client.query('ROLLBACK')
      flashMessage(req, 'error', 'Peminjaman ini sudah diproses sebelumnya.')
      return res.redirect('back')
    }

    const rejectionNotes = notes || 'Tidak memenuhi syarat peminjaman.'
    await client.query(
      `UPDATE borrows SET status = 'ditolak', reviewed_by = $1, reviewed_at = NOW(), notes = $2, updated_at = NOW() WHERE id = $3`,
      [req.user!.id, rejectionNotes, borrow.id]
    )
    
    await client.query('UPDATE items SET stock_available = stock_available + $1 WHERE id = $2', [borrow.quantity, borrow.item_id])

    const itemRes = await client.query('SELECT name FROM items WHERE id = $1', [borrow.item_id])
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type, related_borrow_id) VALUES ($1, $2, $3, 'rejected', $4)`,
      [borrow.user_id, 'Peminjaman ditolak', `Peminjaman ${itemRes.rows[0].name} ditolak. Alasan: ${rejectionNotes}`, borrow.id]
    )

    await client.query('COMMIT')
    flashMessage(req, 'success', 'Peminjaman berhasil ditolak dan stok dikembalikan.')
    res.redirect('/admin/borrows')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).send('Server Error')
  } finally {
    client.release()
  }
})

router.post('/admin/borrows/:id/return', async (req, res) => {
  const { item_condition_on_return, notes } = req.body
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const borrowRes = await client.query('SELECT * FROM borrows WHERE id = $1 FOR UPDATE', [req.params.id])
    if (borrowRes.rows.length === 0) throw new Error('Not Found')
    const borrow = borrowRes.rows[0]

    if (!['disetujui', 'dipinjam', 'terlambat'].includes(borrow.status)) {
      await client.query('ROLLBACK')
      flashMessage(req, 'error', 'Peminjaman belum bisa dikonfirmasi kembali.')
      return res.redirect('back')
    }

    await client.query(
      `UPDATE borrows SET status = 'dikembalikan', actual_return_date = CURRENT_DATE, item_condition_on_return = $1, notes = COALESCE($2, notes), updated_at = NOW() WHERE id = $3`,
      [item_condition_on_return, notes, borrow.id]
    )
    
    await client.query('UPDATE items SET stock_available = stock_available + $1, condition = $2, updated_at = NOW() WHERE id = $3', [borrow.quantity, item_condition_on_return, borrow.item_id])

    const itemRes = await client.query('SELECT name FROM items WHERE id = $1', [borrow.item_id])
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type, related_borrow_id) VALUES ($1, $2, $3, 'returned', $4)`,
      [borrow.user_id, 'Pengembalian dikonfirmasi', `Pengembalian ${itemRes.rows[0].name} sudah dikonfirmasi oleh staf/admin.`, borrow.id]
    )

    await client.query('COMMIT')
    flashMessage(req, 'success', 'Pengembalian berhasil dikonfirmasi dan stok diperbarui.')
    res.redirect('/admin/borrows')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).send('Server Error')
  } finally {
    client.release()
  }
})

export default router
