import { Router } from 'express'
import bcrypt from 'bcrypt'
import pool from '../db.js'
import { flashMessage } from '../inertia.js'

const router = Router()

router.get('/login', (req, res) => {
  if (req.session.userId && req.user) {
    return res.redirect(req.user.role === 'admin' || req.user.role === 'staf' ? '/admin' : '/dashboard')
  }
  req.inertia.render('auth/login')
})

router.get('/register', (req, res) => {
  if (req.session.userId && req.user) {
    return res.redirect(req.user.role === 'admin' || req.user.role === 'staf' ? '/admin' : '/dashboard')
  }
  req.inertia.render('auth/register')
})

router.post('/login', async (req, res) => {
  const { email, password, remember } = req.body

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user || !(await bcrypt.compare(password, user.password))) {
      flashMessage(req, 'error', 'Email atau password salah.')
      return res.redirect('back')
    }

    if (!user.is_active) {
      flashMessage(req, 'error', 'Akun sedang dinonaktifkan. Hubungi admin lab.')
      return res.redirect('back')
    }

    req.session.userId = user.id
    if (remember) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days
    }
    
    flashMessage(req, 'success', `Selamat datang, ${user.full_name}.`)
    return res.redirect(user.role === 'admin' || user.role === 'staf' ? '/admin' : '/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    flashMessage(req, 'error', 'Terjadi kesalahan sistem.')
    return res.redirect('back')
  }
})

router.post('/register', async (req, res) => {
  const { full_name, nim_nip, email, password, password_confirmation } = req.body

  if (!full_name || !email || !password || !password_confirmation) {
    flashMessage(req, 'error', 'Mohon lengkapi semua field yang diwajibkan.')
    return res.redirect('back')
  }

  if (password !== password_confirmation) {
    flashMessage(req, 'error', 'Konfirmasi password tidak cocok.')
    return res.redirect('back')
  }

  if (password.length < 8) {
    flashMessage(req, 'error', 'Password minimal harus 8 karakter.')
    return res.redirect('back')
  }

  try {
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      flashMessage(req, 'error', 'Email tersebut sudah terdaftar.')
      return res.redirect('back')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const insertResult = await pool.query(
      `INSERT INTO users (full_name, email, password, role, nim_nip, is_active)
       VALUES ($1, $2, $3, 'mahasiswa', $4, true) RETURNING *`,
      [full_name, email, passwordHash, nim_nip || null]
    )

    const newUser = insertResult.rows[0]
    
    // Auto-login
    req.session.userId = newUser.id
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days
    
    flashMessage(req, 'success', 'Akun berhasil dibuat! Anda sudah otomatis login.')
    return res.redirect('/dashboard')
  } catch (error) {
    console.error('Register error:', error)
    flashMessage(req, 'error', 'Terjadi kesalahan saat registrasi akun.')
    return res.redirect('back')
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    // Cannot flash after destroy easily, but typically acceptable
    res.redirect('/login')
  })
})

export default router
