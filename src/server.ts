import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import ConnectPgSimple from 'connect-pg-simple'
import methodOverride from 'method-override'
import cron from 'node-cron'
import { DateTime } from 'luxon'
import { createServer as createViteServer } from 'vite'

import pool from './db.js'
import { inertiaMiddleware, setViteDevServer } from './inertia.js'

// Routes
import authRoutes from './routes/auth.js'
import landingRoutes from './routes/landing.js'
import userDashboardRoutes from './routes/userDashboard.js'
import itemsRoutes from './routes/items.js'
import borrowsRoutes from './routes/borrows.js'
import notificationsRoutes from './routes/notifications.js'
import usersRoutes from './routes/users.js'
import reportsRoutes from './routes/reports.js'
import adminDashboardRoutes from './routes/adminDashboard.js'
import profileRoutes from './routes/profile.js'

const app = express()

// PostgreSQL Session Store
const PgSession = ConnectPgSimple(session)

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method
    delete req.body._method
    return method
  }
}))
// Inertia uses X-HTTP-Method-Override header for PUT/PATCH/DELETE
app.use(methodOverride('X-HTTP-Method-Override'))

app.use(session({
  store: new PgSession({
    pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day default
}))

// Vite Dev Server Setup
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  app.use(vite.middlewares)
  setViteDevServer(vite)
} else {
  // Static files in production
  app.use(express.static('dist/client'))
}

app.use(inertiaMiddleware)

// Mount Routes
app.use(landingRoutes)
app.use(authRoutes)
app.use(userDashboardRoutes)
app.use(itemsRoutes)
app.use(borrowsRoutes)
app.use(notificationsRoutes)
app.use(usersRoutes)
app.use(reportsRoutes)
app.use(adminDashboardRoutes)
app.use(profileRoutes)

// Cron job for overdue borrows
cron.schedule('5 0 * * *', async () => {
  try {
    const today = DateTime.local().startOf('day').toSQLDate()
    const overdueRes = await pool.query(`
      SELECT b.*, i.name as item_name 
      FROM borrows b JOIN items i ON b.item_id = i.id
      WHERE b.status IN ('disetujui', 'dipinjam') AND b.return_date < $1
    `, [today])

    if (overdueRes.rows.length === 0) return

    for (const borrow of overdueRes.rows) {
      await pool.query("UPDATE borrows SET status = 'terlambat', updated_at = NOW() WHERE id = $1", [borrow.id])
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, related_borrow_id) VALUES ($1, $2, $3, 'reminder', $4)`,
        [borrow.user_id, 'Peminjaman terlambat', `Peminjaman ${borrow.item_name} telah melewati tanggal kembali. Segera kembalikan ke staf lab.`, borrow.id]
      )
    }

    const adminsRes = await pool.query("SELECT id FROM users WHERE role IN ('admin', 'staf') AND is_active = true")
    for (const admin of adminsRes.rows) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, 'reminder')`,
        [admin.id, 'Peminjaman terlambat', `Ada ${overdueRes.rows.length} peminjaman terlambat yang perlu dipantau.`]
      )
    }
    console.log(`[Scheduler] ${overdueRes.rows.length} peminjaman ditandai terlambat.`)
  } catch (err) {
    console.error('[Scheduler] Gagal menjalankan overdue checker:', err)
  }
})

// Start Server
const PORT = process.env.PORT || 3333
const HOST = process.env.HOST || 'localhost'

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})
