import type { Request, Response, NextFunction } from 'express'
import pool from '../db.js'
import { flashMessage } from '../inertia.js'

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    flashMessage(req, 'error', 'Silakan login terlebih dahulu.')
    return res.redirect('/login')
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId])
    if (result.rows.length === 0) {
      req.session.destroy(() => {})
      flashMessage(req, 'error', 'Silakan login terlebih dahulu.')
      return res.redirect('/login')
    }

    const user = result.rows[0]

    if (!user.is_active) {
      req.session.destroy(() => {})
      flashMessage(req, 'error', 'Akun kamu sedang dinonaktifkan. Hubungi admin lab.')
      return res.redirect('/login')
    }

    req.user = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      nimNip: user.nim_nip,
      isActive: user.is_active,
    }

    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    flashMessage(req, 'error', 'Terjadi kesalahan autentikasi.')
    return res.redirect('/login')
  }
}
